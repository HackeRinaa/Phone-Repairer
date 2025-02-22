import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

// Define types for items and booking data
interface Item {
  title: string;
  price: number;
}

interface BookingData {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  paymentMethod: 'online' | 'instore';
}

// Helper function to calculate amount in cents
function calculateAmount(items: Item[]): number {
  return items.reduce((total, item) => total + (item.price * 100), 0);
}

export async function POST(req: Request) {
  try {
    const body: { items: Item[]; bookingData: BookingData } = await req.json();
    console.log('Received payload:', body); // Debugging

    const { items, bookingData } = body;

    // Validate the payload
    if (!Array.isArray(items) || !bookingData || typeof bookingData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload: items must be an array and bookingData must be an object' },
        { status: 400 }
      );
    }

    // Calculate amount in cents
    const amount = calculateAmount(items);
    console.log('Calculated amount:', amount);

    if (amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least 50 cents' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
    });

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        brand: items[0].title.split(' - ')[0].split(' ')[0],
        model: items[0].title.split(' - ')[0].split(' ').slice(1).join(' '),
        issues: items.map(item => item.title.split(' - ')[1]),
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email,
        phone: bookingData.contactInfo.phone,
        address: bookingData.contactInfo.address || '',
        notes: bookingData.contactInfo.notes || '',
        date: new Date(bookingData.date),
        timeSlot: bookingData.timeSlot,
        totalAmount: amount / 100,
        paymentMethod: 'online',
        paymentId: paymentIntent.id,
        status: 'pending',
        paymentStatus: 'pending',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Full error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}