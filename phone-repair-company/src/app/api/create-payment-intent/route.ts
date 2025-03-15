import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Define types for items and booking data
interface Item {
  title: string;
  price: number;
}

interface BookingFormData {
  date: string | null;
  timeSlot: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  paymentMethod: 'online' | 'instore';
}

// Extended user type to include id
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
}

// Helper function to calculate amount in cents
function calculateAmount(items: Item[]): number {
  return items.reduce((total, item) => total + (item.price * 100), 0);
}

export async function POST(req: Request) {
  try {
    const body: { items: Item[]; bookingData: BookingFormData } = await req.json();
    console.log('Received payload:', body); // Debugging

    const { items, bookingData: formData } = body;

    // Validate the payload
    if (!Array.isArray(items) || !formData || typeof formData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload: items must be an array and bookingData must be an object' },
        { status: 400 }
      );
    }

    // Get user session if available
    const session = await getServerSession(authOptions);
    
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

    // Prepare booking data for database
    const bookingData = {
      brand: items[0].title.split(' - ')[0].split(' ')[0],
      model: items[0].title.split(' - ')[0].split(' ').slice(1).join(' '),
      issues: items.map(item => item.title.split(' - ')[1]),
      name: formData.contactInfo.name,
      email: formData.contactInfo.email,
      phone: formData.contactInfo.phone,
      address: formData.contactInfo.address || '',
      notes: formData.contactInfo.notes || '',
      date: formData.date ? new Date(formData.date) : new Date(), // Use current date if not provided
      timeSlot: formData.timeSlot || '',
      totalAmount: amount / 100,
      paymentMethod: 'online',
      paymentId: paymentIntent.id,
      status: 'pending',
      paymentStatus: 'pending',
    };
    
    // Add userId if user is logged in
    if (session?.user) {
      const user = session.user as ExtendedUser;
      if (user.id) {
        // @ts-expect-error - userId exists in the Prisma schema but TypeScript doesn't know about it
        bookingData.userId = user.id;
      }
    }

    // Create booking record
    const booking = await prisma.booking.create({
      data: bookingData,
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