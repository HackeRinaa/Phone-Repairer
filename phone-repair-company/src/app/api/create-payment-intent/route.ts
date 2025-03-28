import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any // Type assertion to avoid TypeScript error
});

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

export async function POST(request: Request) {
  try {
    const { items, bookingData } = await request.json();
    console.log('Received payment request:', { items, bookingData });

    // Validate required fields
    if (!bookingData.date || !bookingData.timeSlot || !bookingData.contactInfo.name) {
      console.log('Missing required fields:', {
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        name: bookingData.contactInfo.name
      });
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty items array' },
        { status: 400 }
      );
    }

    // Extract brand and model from the first item's title if available
    let brand = '';
    let model = '';
    
    if (items.length > 0) {
      const firstItem = items[0];
      const titleParts = firstItem.title.split(' - ');
      if (titleParts.length > 0) {
        const deviceParts = titleParts[0].split(' ');
        if (deviceParts.length > 0) {
          brand = deviceParts[0];
        }
        if (deviceParts.length > 1) {
          model = deviceParts.slice(1).join(' ');
        }
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: {price: number}) => total + item.price, 0);
    console.log('Calculated total amount:', totalAmount);

    // Convert date string to Date object if needed
    const bookingDate = new Date(bookingData.date);

    // Store device details in the notes field as JSON
    const deviceDetails = {
      brand,
      model
    };

    const notesWithDeviceDetails = JSON.stringify({
      userNotes: bookingData.contactInfo.notes || '',
      deviceDetails
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        bookingDate: bookingData.date.toString(),
        timeSlot: bookingData.timeSlot,
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email,
        phone: bookingData.contactInfo.phone,
        address: bookingData.contactInfo.address || '',
        notes: bookingData.contactInfo.notes || '',
        paymentMethod: bookingData.paymentMethod,
        brand: brand,
        model: model
      }
    });

    console.log('Stripe payment intent created:', paymentIntent.id);

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        timeSlot: bookingData.timeSlot,
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email,
        phone: bookingData.contactInfo.phone,
        address: bookingData.contactInfo.address || '',
        notes: notesWithDeviceDetails,
        status: 'PENDING',
        type: 'PRODUCT',
        totalAmount,
        paymentMethod: bookingData.paymentMethod,
        paymentStatus: 'PENDING',
        stripePaymentIntentId: paymentIntent.id
      }
    });

    console.log('Booking created successfully:', booking);

    // Add the device details to the response object
    const bookingWithDeviceDetails = {
      ...booking,
      deviceDetails
    };

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      booking: bookingWithDeviceDetails
    });
  } catch (error) {
    console.error('Detailed payment intent creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}