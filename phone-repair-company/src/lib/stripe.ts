import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key Length:', stripeSecretKey.length); // Debug log
console.log('Stripe Secret Key:', stripeSecretKey); // Debugging

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
}); 