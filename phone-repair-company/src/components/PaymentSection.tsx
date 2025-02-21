import { useState } from 'react';
import Calendar from 'react-calendar';
import { loadStripe } from '@stripe/stripe-js';
import 'react-calendar/dist/Calendar.css';

interface PaymentSectionProps {
  totalAmount: number;
  itemDetails: {
    title: string;
    price: number;
  }[];
  onComplete: (data: BookingData) => void;
}

export interface BookingData {
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

export function PaymentSection({ totalAmount, itemDetails, onComplete }: PaymentSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
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

  const handlePayment = async () => {
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
      if (!stripe) return;

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (result.error) {
        console.error(result.error);
      } else {
        onComplete(bookingData);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="font-medium mb-4">Select Pickup Date</h3>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
                setBookingData({ ...bookingData, date: value });
              }
            }}
            value={selectedDate}
            minDate={new Date()}
            className="w-full border-0 rounded-lg"
          />
          
          {selectedDate && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Available Time Slots</h4>
              <div className="grid grid-cols-2 gap-2">
                {['09:00', '11:00', '13:00', '15:00', '17:00'].map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setBookingData({ ...bookingData, timeSlot: time });
                    }}
                    className={`p-2 text-sm border rounded-lg transition-colors ${
                      selectedTime === time 
                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-900' 
                        : 'hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="font-medium mb-4">Contact Information</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={bookingData.contactInfo.name}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, name: e.target.value }
                })}
                className="w-full p-2 rounded-lg border dark:bg-gray-700"
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
                className="w-full p-2 rounded-lg border dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={bookingData.contactInfo.phone}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, phone: e.target.value }
                })}
                className="w-full p-2 rounded-lg border dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Address</label>
              <input
                type="text"
                value={bookingData.contactInfo.address}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, address: e.target.value }
                })}
                className="w-full p-2 rounded-lg border dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                value={bookingData.contactInfo.notes}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  contactInfo: { ...bookingData.contactInfo, notes: e.target.value }
                })}
                className="w-full p-2 rounded-lg border dark:bg-gray-700"
                rows={3}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Payment Method & Summary */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl">
        <h3 className="font-medium mb-4">Payment Method</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="online"
              value="online"
              checked={bookingData.paymentMethod === 'online'}
              onChange={() => setBookingData({ ...bookingData, paymentMethod: 'online' })}
              className="text-blue-600"
            />
            <label htmlFor="online">Pay Online Now (Secure payment with Stripe)</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="instore"
              value="instore"
              checked={bookingData.paymentMethod === 'instore'}
              onChange={() => setBookingData({ ...bookingData, paymentMethod: 'instore' })}
              className="text-blue-600"
            />
            <label htmlFor="instore">Pay In-Store</label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium mb-2">Order Summary</h4>
          <div className="space-y-2">
            {itemDetails.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.title}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-medium text-base border-t pt-2">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={bookingData.paymentMethod === 'online' ? handlePayment : () => onComplete(bookingData)}
          disabled={!selectedDate || !selectedTime || !bookingData.contactInfo.name || !bookingData.contactInfo.email}
          className={`w-full mt-6 py-3 rounded-lg transition-colors ${
            (!selectedDate || !selectedTime || !bookingData.contactInfo.name || !bookingData.contactInfo.email)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {bookingData.paymentMethod === 'online' ? 'Pay & Schedule Pickup' : 'Schedule Pickup'}
        </button>
      </div>
    </div>
  );
} 