"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Calendar from 'react-calendar';
import './Calendar.css';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentFormProps {
  onSuccess: () => void;
}

interface PaymentSectionProps {
  totalAmount: number;
  itemDetails: Array<{ title: string; price: number }>;
  onComplete: (data: BookingData) => void;
  pageId: number;
  repair?: boolean;
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

function PaymentForm({ onSuccess}: PaymentFormProps) {
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

export function PaymentSection({ totalAmount, itemDetails, onComplete, pageId }: PaymentSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const [listingId, setListingId] = useState<string>('');
  const [nextStep, setNextStep] = useState(false);
  const [phoneDetails, setPhoneDetails] = useState<{brand?: string, model?: string}>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  const handleInputChange = (field: keyof BookingData['contactInfo'], value: string) => {
    let isValid = true;
    let errorMsg = '';

    switch (field) {
      case 'name':
        isValid = /^[A-Za-zΑ-Ωα-ω\s]+$/.test(value);
        errorMsg = isValid ? '' : 'Το όνομα πρέπει να περιέχει μόνο γράμματα.';
        break;
      case 'email':
        isValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value);
        errorMsg = isValid ? '' : 'Μη έγκυρη διεύθυνση email.';
        break;
      case 'phone':
        isValid = /^\+?\d{10,15}$/.test(value);
        errorMsg = isValid ? '' : 'Μη έγκυρος αριθμός τηλεφώνου.';
        break;
      case 'address':
        isValid = /^[A-Za-zΑ-Ωα-ω0-9\s,.-]+$/.test(value);
        errorMsg = isValid ? '' : 'Μη έγκυρη διεύθυνση.';
        break;
    }

    setBookingData({
      ...bookingData,
      contactInfo: { ...bookingData.contactInfo, [field]: value },
    });

    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: errorMsg
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (pageId === 1) {
        // For repair booking without payment
        const response = await fetch('/api/create-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingData: {
              ...bookingData,
              date: selectedDate,
              timeSlot: selectedTime
            },
            itemDetails: itemDetails
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create booking');
        }

        const data = await response.json();
        console.log(`data from post id=1 ${data}`);
        
        // Set phone details from the first item
        if (itemDetails && itemDetails.length > 0) {
          const firstItem = itemDetails[0];
          const titleParts = firstItem.title.split(' - ');
          
          // Extract brand and model more carefully with defaults
          let brand = 'Συσκευή';
          let model = '';
          
          if (titleParts.length > 0 && titleParts[0].trim() !== '') {
            const parts = titleParts[0].split(' ');
            if (parts.length > 0) {
              brand = parts[0];
              if (parts.length > 1) {
                model = parts.slice(1).join(' ');
              }
            }
          }
          
          console.log('Extracted phone details:', { brand, model });
          setPhoneDetails({ brand, model });
        }
        
        onComplete({
          ...bookingData,
          date: selectedDate,
          timeSlot: selectedTime
        });
        setListingId(data.listing?.id || 'N/A');
        setNextStep(true);
      } else if (pageId === 2) {
        // For phone purchase bookings
        
        // If using cash on delivery (payment method is 'instore')
        if (bookingData.paymentMethod === 'instore') {
          try {
            const requestData = {
              bookingData: {
                ...bookingData,
                date: selectedDate,
                timeSlot: selectedTime
              },
              itemDetails: itemDetails
            };
            
            console.log('Sending purchase booking data:', JSON.stringify(requestData));
            
            const response = await fetch('/api/purchase-booking', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestData),
            });
  
            console.log('Response status:', response.status);
            
            if (!response.ok) {
              const responseText = await response.text();
              console.error('Error response:', responseText);
              try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.error || `Failed to create booking: ${response.status}`);
              } catch {
                // Parse error - response is not valid JSON
                throw new Error(`Failed to create booking: ${response.status} - ${responseText.substring(0, 100)}...`);
              }
            }
  
            const data = await response.json();
            console.log('Purchase booking created:', data);
            
            // Set phone details from the first item
            if (itemDetails && itemDetails.length > 0) {
              const firstItem = itemDetails[0];
              const titleParts = firstItem.title.split(' - ');
              
              // Extract brand and model more carefully with defaults
              let brand = 'Συσκευή';
              let model = '';
              
              if (titleParts.length > 0 && titleParts[0].trim() !== '') {
                const parts = titleParts[0].split(' ');
                if (parts.length > 0) {
                  brand = parts[0];
                  if (parts.length > 1) {
                    model = parts.slice(1).join(' ');
                  }
                }
              }
              
              console.log('Extracted phone details:', { brand, model });
              setPhoneDetails({ brand, model });
            }
            
            // Complete the purchase process
            onComplete({
              ...bookingData,
              date: selectedDate,
              timeSlot: selectedTime
            });
            setListingId(data.booking?.id || 'N/A');
            setNextStep(true);
          } catch (error) {
            console.error('Error:', error);
            setErrors({ form: error instanceof Error ? error.message : 'An unexpected error occurred' });
          }
        } else {
          // For online payment (using Stripe)
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: itemDetails,
              bookingData: {
                ...bookingData,
                date: selectedDate,
                timeSlot: selectedTime
              }
            }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create payment intent');
          }
  
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
  
          setClientSecret(data.clientSecret);
          setShowStripePayment(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: error instanceof Error ? error.message : 'An unexpected error occurred' });
    } finally {
      setIsProcessing(false);
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

  return nextStep ? (
    <div className="w-[80%] mx-auto text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        
        {pageId === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-600">
              Η αγγελία σας υποβλήθηκε με επιτυχία!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Η αγγελία σας {phoneDetails.brand && phoneDetails.model ? `για το ${phoneDetails.brand} ${phoneDetails.model}` : 'για τη συσκευή σας'} έχει υποβληθεί και βρίσκεται υπό έγκριση. 
              Θα σας ενημερώσουμε μέσω email μόλις εγκριθεί.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-600">
              {bookingData.paymentMethod === 'instore' ? 'Η παραγγελία σας καταχωρήθηκε!' : 'Η αγορά ολοκληρώθηκε!'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {bookingData.paymentMethod === 'instore' 
                ? `Η αγορά ${phoneDetails.brand && phoneDetails.model ? `του ${phoneDetails.brand} ${phoneDetails.model}` : 'της συσκευής'} έχει καταχωρηθεί. Θα επικοινωνήσουμε μαζί σας για την παράδοση. Η πληρωμή θα γίνει κατά την παραλαβή.` 
                : `Η αγορά ${phoneDetails.brand && phoneDetails.model ? `του ${phoneDetails.brand} ${phoneDetails.model}` : 'της συσκευής'} ολοκληρώθηκε επιτυχώς. Θα λάβετε ένα email επιβεβαίωσης με τα στοιχεία της παραγγελίας σας.`}
            </p>
          </>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pageId === 1 ? 'Αριθμός Αγγελίας:' : 'Αριθμός Παραγγελίας:'} <span className="font-medium text-gray-700 dark:text-gray-300">{listingId}</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 border border-purple-600 dark:text-white rounded-lg hover:bg-purple-200 dark:hover:bg-gray-600 transition-colors">
            Επιστροφή στην Αρχική
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full mx-auto space-y-8">
      {/* Main Grid: Calendar and Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Calendar & Time Slots */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
          <h3 className="text-xl font-semibold mb-4 dark:text-white text-gray-600">Επιλέξτε Ημερομηνία & Ώρα</h3>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            minDate={new Date()}
            className="w-full border-0 rounded-lg mb-6"
          />
          
          {selectedDate && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 dark:text-white text-gray-600">Διαθέσιμες Ώρες</h4>
              <div className="grid grid-cols-3 gap-2 dark:text-white text-gray-600">
                {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 text-sm rounded-lg transition-colors ${
                      selectedTime === time 
                        ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-all hover:scale-105 dark:hover:bg-purple-600'
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
          <h3 className="text-xl font-semibold mb-4 dark:text-white text-gray-600">Στοιχεία Επικοινωνίας</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white text-gray-600">Ονοματεπώνυμο</label>
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
              <input
                type="text"
                value={bookingData.contactInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white text-gray-600">Email</label>
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
              <input
                type="email"
                value={bookingData.contactInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white text-gray-600">Τηλέφωνο</label>
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
              <input
                type="tel"
                value={bookingData.contactInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white text-gray-600">Διεύθυνση</label>
              {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
              <input
                type="text"
                value={bookingData.contactInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white text-gray-600">Σημειώσεις</label>
              <textarea
                value={bookingData.contactInfo.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-gray-600"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {pageId !== 1 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
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
                    <div className="font-medium">Πληρωμή κατά την παράδοση</div>
                    <div className="text-sm text-gray-500">Μετρητά ή κάρτα</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 dark:text-white text-gray-600">Σύνοψη Παραγγελίας</h3>
              <div className="space-y-4">
                {itemDetails.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b dark:text-white text-gray-600">
                    <span>{item.title}</span>
                    <span className="font-medium text-purple-600">{item.price}€</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-bold dark:text-white text-gray-600">
                  <span>Σύνολο</span>
                  <span className='text-purple-600'>{totalAmount}€</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime || !bookingData.contactInfo.name || isProcessing}
                className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
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
      )}

      {pageId === 1 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || !bookingData.contactInfo.name || isProcessing}
            className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
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
              'Κράτηση Ημερομηνίας'
            )}
          </button>
        </div>
      )}

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}
    </div>
  );
}
