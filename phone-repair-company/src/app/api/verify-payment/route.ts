import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { paymentIntent } = await req.json();

    const payment = await stripe.paymentIntents.retrieve(paymentIntent);
    
    if (payment.status === 'succeeded') {
      try {
        // Use findFirst and then update by id to avoid type issues
        const booking = await prisma.booking.findFirst({
          where: { paymentId: paymentIntent }
        });

        if (!booking) {
          return NextResponse.json(
            { error: 'Booking not found for this payment' },
            { status: 404 }
          );
        }

        // Update by id which is always a valid unique identifier
        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            paymentStatus: 'completed',
            status: 'confirmed'
          },
        });

        return NextResponse.json({ success: true });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 