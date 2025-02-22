import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mail';

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    // Update booking status
    const booking = await prisma.booking.update({
      where: { paymentId: paymentIntent.id },
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
  const headers = await req.headers;

  const signature = headers.get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
} 