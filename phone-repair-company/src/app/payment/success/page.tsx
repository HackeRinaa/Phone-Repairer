"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get('payment_intent');

  useEffect(() => {
    if (payment_intent) {
      // You can verify the payment status here
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntent: payment_intent }),
      });
    }
  }, [payment_intent]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Επιτυχής Πληρωμή!</h1>
        <p className="text-gray-600 text-center mb-6">
          Η παραγγελία σας έχει καταχωρηθεί και θα επεξεργαστεί άμεσα.
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Επιστροφή στην Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
} 