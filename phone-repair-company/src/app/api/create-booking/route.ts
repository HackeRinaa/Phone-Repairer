import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookingData } = await request.json();
    console.log('Received booking data:', bookingData);

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

    // Convert date string to Date object if needed
    const bookingDate = new Date(bookingData.date);

    // Create the booking in the database
    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        timeSlot: bookingData.timeSlot,
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email,
        phone: bookingData.contactInfo.phone,
        address: bookingData.contactInfo.address || '',
        notes: bookingData.contactInfo.notes || '',
        status: 'PENDING',
        type: 'REPAIR'
      }
    });

    console.log('Booking created successfully:', booking);

    return NextResponse.json({ 
      success: true, 
      booking 
    });
  } catch (error) {
    console.error('Detailed booking creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 