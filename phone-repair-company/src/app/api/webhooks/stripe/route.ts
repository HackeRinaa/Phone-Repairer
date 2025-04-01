import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mail';

// Define a more specific type for PaymentIntent with index signature
type PaymentIntent = Record<string, unknown> & {
  id: string;
  metadata: Record<string, string>;
};

async function handlePaymentSuccess(paymentIntent: PaymentIntent) {
  try {
    // Update booking status
    const booking = await prisma.booking.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { 
        paymentStatus: 'completed',
        status: 'confirmed'
      },
    });

    // Send confirmation email
    await sendMail({
      to: booking.email,
      subject: 'Επιβεβαίωση Πληρωμής - Fix & Go',
      html: `
        <h2>Η πληρωμή σας ολοκληρώθηκε με επιτυχία!</h2>
        <p>Αγαπητέ/ή ${booking.name},</p>
        <p>Η πληρωμή σας για το ποσό των ${booking.totalAmount}€ έχει επιβεβαιωθεί.</p>
        <p><strong>Στοιχεία Κράτησης:</strong></p>
        <ul>
          <li>Αριθμός Κράτησης: ${booking.id}</li>
          <li>Ημερομηνία: ${new Date(booking.date).toLocaleDateString('el')}</li>
          <li>Ώρα: ${booking.timeSlot}</li>
          <li>Συσκευή: ${booking.brand} ${booking.model}</li>
        </ul>
        <p>Ευχαριστούμε για την εμπιστοσύνη σας!</p>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const headers = req.headers;
  const signature = headers.get('stripe-signature');

  try {
    // Safely handle potentially null signature 
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing signature or webhook secret');
    }
    
    const event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
} 