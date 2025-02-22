import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { paymentIntent } = await req.json();

    const payment = await stripe.paymentIntents.retrieve(paymentIntent);
    
    if (payment.status === 'succeeded') {
      // Update booking status
      await prisma.booking.update({
        where: { paymentId: paymentIntent },
        data: { 
          paymentStatus: 'completed',
          status: 'confirmed'
        },
      });

      return NextResponse.json({ success: true });
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