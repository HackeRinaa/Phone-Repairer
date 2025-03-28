import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookingData, itemDetails } = await request.json();
    console.log('Received booking data:', bookingData);
    console.log('Received item details:', itemDetails);

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

    // Extract brand and model from the first item's title if available
    let brand = '';
    let model = '';
    const issues: string[] = [];

    if (itemDetails && itemDetails.length > 0) {
      // Process each item to extract device details and issues
      itemDetails.forEach((item: { title: string }) => {
        const parts = item.title.split(' - ');
        if (parts.length >= 2) {
          const deviceParts = parts[0].split(' ');
          if (!brand && deviceParts.length > 0) {
            brand = deviceParts[0];
          }
          if (!model && deviceParts.length > 1) {
            model = deviceParts.slice(1).join(' ');
          }
          // Add issue to the issues array
          if (parts.length > 1) {
            issues.push(parts[1]);
          }
        }
      });
    }

    // Convert date string to Date object if needed
    const bookingDate = new Date(bookingData.date);

    // Store device details and issues in the notes field as JSON
    const deviceDetails = {
      brand,
      model,
      issues
    };

    const notesWithDeviceDetails = JSON.stringify({
      userNotes: bookingData.contactInfo.notes || '',
      deviceDetails
    });

    // Create the booking in the database
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
        type: 'REPAIR'
      }
    });

    console.log('Booking created successfully:', booking);

    // Add the device details to the response object
    const bookingWithDeviceDetails = {
      ...booking,
      deviceDetails
    };

    return NextResponse.json({ 
      success: true, 
      booking: bookingWithDeviceDetails 
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