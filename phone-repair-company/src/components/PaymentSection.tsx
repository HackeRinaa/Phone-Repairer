"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

interface PaymentSectionProps {
  totalAmount: number;
  itemDetails: Array<{ title: string; price: number }>;
  onComplete: (data: BookingData) => void;
}

interface BookingData {
  date: Date | null;
  timeSlot: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  paymentMethod: 'online' | 'instore';
}

function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment processing error');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl">
      <PaymentElement />
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export function PaymentSection({ totalAmount, itemDetails, onComplete }: PaymentSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [bookingData, setBookingData] = useState<BookingData>({
    date: null,
    timeSlot: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
    paymentMethod: 'online'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      items: itemDetails,
      bookingData: bookingData
    };

    console.log('Sending payload:', payload); // Debugging

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log the error response
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
      setShowStripePayment(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

 
  if (showStripePayment && clientSecret) {
    return (
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setShowStripePayment(false)}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Επιστροφή στην φόρμα κράτησης
        </button>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={() => {
              onComplete({
                ...bookingData,
                date: selectedDate,
                timeSlot: selectedTime
              });
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Main Grid: Calendar and Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Calendar & Time Slots */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Επιλέξτε Ημερομηνία & Ώρα</h3>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            minDate={new Date()}
            className="w-full border-0 rounded-lg mb-6"
          />
          
          {selectedDate && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Διαθέσιμες Ώρες</h4>
              <div className="grid grid-cols-3 gap-2">
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 text-sm rounded-lg transition-colors ${
                      selectedTime === time 
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Στοιχεία Επικοινωνίας</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ονοματεπώνυμο</label>
              <input
                type="text"
                value={bookingData.contactInfo.name}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, name: e.target.value }
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={bookingData.contactInfo.email}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, email: e.target.value }
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Τηλέφωνο</label>
              <input
                type="tel"
                value={bookingData.contactInfo.phone}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, phone: e.target.value }
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Διεύθυνση</label>
              <input
                type="text"
                value={bookingData.contactInfo.address}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, address: e.target.value }
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Σημειώσεις</label>
              <textarea
                value={bookingData.contactInfo.notes}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, notes: e.target.value }
                })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Payment & Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Method Selection */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Τρόπος Πληρωμής</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={bookingData.paymentMethod === 'online'}
                  onChange={() => setBookingData({ ...bookingData, paymentMethod: 'online' })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Online Πληρωμή</div>
                  <div className="text-sm text-gray-500">Πληρώστε με κάρτα</div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="instore"
                  checked={bookingData.paymentMethod === 'instore'}
                  onChange={() => setBookingData({ ...bookingData, paymentMethod: 'instore' })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Πληρωμή στο Κατάστημα</div>
                  <div className="text-sm text-gray-500">Μετρητά ή κάρτα</div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Σύνοψη Παραγγελίας</h3>
            <div className="space-y-4">
              {itemDetails.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.title}</span>
                  <span className="font-medium">{item.price}€</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 text-lg font-bold">
                <span>Σύνολο</span>
                <span>{totalAmount}€</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || !bookingData.contactInfo.name || isProcessing}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Επεξεργασία...
                </span>
              ) : (
                'Ολοκλήρωση Κράτησης'
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 