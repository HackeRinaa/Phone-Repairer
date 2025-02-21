import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

// Add price mapping for repair issues
const REPAIR_PRICES = {
  "Screen Repair": 8900, // $89.00
  "Battery Replacement": 4900, // $49.00
  "Water Damage": 9900, // $99.00
  "Camera Fix": 6900, // $69.00
};

function calculateAmount(items: string[]): number {
  return items.reduce((total, item) => {
    return total + (REPAIR_PRICES[item as keyof typeof REPAIR_PRICES] || 0);
  }, 0);
}

export async function POST(req: Request) {
  try {
    const { items, brand, model } = await req.json();

    // Calculate the amount based on selected issues
    const amount = calculateAmount(items);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        brand,
        model,
        issues: items.join(', '),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 });
  }
} 