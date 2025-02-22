import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { items, bookingData } = await req.json();

    const booking = await prisma.booking.create({
      data: {
        brand: items[0].title.split(' - ')[0].split(' ')[0],
        model: items[0].title.split(' - ')[0].split(' ').slice(1).join(' '),
        issues: items.map((item: any) => item.title.split(' - ')[1]),
        name: bookingData.contactInfo.name,
        email: bookingData.contactInfo.email,
        phone: bookingData.contactInfo.phone,
        address: bookingData.contactInfo.address,
        notes: bookingData.contactInfo.notes,
        date: new Date(bookingData.date),
        timeSlot: bookingData.timeSlot,
        totalAmount: items.reduce((total: number, item: any) => total + item.price, 0),
        paymentMethod: bookingData.paymentMethod,
        status: 'pending',
        paymentStatus: bookingData.paymentMethod === 'instore' ? 'pending' : 'completed',
      },
    });

    return NextResponse.json({ 
      success: true,
      bookingId: booking.id 
    });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 