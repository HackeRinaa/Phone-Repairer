"use client";
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';


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



export function PaymentSection({ totalAmount, itemDetails, onComplete, pageId }: PaymentSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);
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

  // Add onBack prop handler
  const handleBack = () => {
    // When pageId is 1, go back to repair step 3
    if (pageId === 1) {
      // Navigate back to repair page with step=3 parameter
      window.location.href = '/repair?step=3';
    }
    // When pageId is 3, go back to purchase step
    else if (pageId === 3) {
      // Navigate back to purchase page with step=3 parameter
      window.location.href = '/purchase?step=3';
    }
    // Default fallback
    else {
      window.history.back();
    }
  };

  // Fetch available hours from API
  useEffect(() => {
    const fetchAvailableHours = async () => {
      try {
        setLoadingHours(true);
        const response = await fetch('/api/available-hours');
        if (response.ok) {
          const data = await response.json();
          setAvailableHours(data.hours);
        } else {
          // Fallback to default hours
          setAvailableHours(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']);
        }
      } catch (error) {
        console.error('Error fetching available hours:', error);
        // Fallback to default hours
        setAvailableHours(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchAvailableHours();
  }, []);

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
        // Use a single API endpoint with better type handling
        const apiEndpoint = '/api/create-booking';
        
        // Determine the booking type based on pageId
        // pageId 1 = listing/repair, pageId 2 = purchase
        const bookingType = pageId === 1 ? 'REPAIR' : 'PRODUCT';
        
        console.log(`Creating ${bookingType} booking via ${apiEndpoint}`);
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingData: {
              ...bookingData,
              date: selectedDate,
              timeSlot: selectedTime
            },
            itemDetails: itemDetails,
            type: bookingType // Pass the type explicitly
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create booking');
        }

        const data = await response.json();
        console.log(`Booking created successfully:`, data);
        
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
        
        // Complete the process and notify parent component
        onComplete({
          ...bookingData,
          date: selectedDate,
          timeSlot: selectedTime
        });
        
        // Get the booking ID from the response
        const uid = uuidv4();
        setListingId(data.booking?.id || uid);
        setNextStep(true);
      } 
     catch (error) {
      console.error('Error during submission:', error);
      setErrors({ form: error instanceof Error ? error.message : 'An unexpected error occurred' });
    } finally {
      setIsProcessing(false);
    }
  };


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
              Η παραγγελία σας υποβλήθηκε με επιτυχία!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Η παραγγελία σας {phoneDetails.brand && phoneDetails.model ? `για το ${phoneDetails.brand} ${phoneDetails.model}` : 'για τη συσκευή σας'} έχει υποβληθεί και βρίσκεται υπό έγκριση. 
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
            {'Αριθμός Παραγγελίας:'} <span className="font-medium text-gray-700 dark:text-gray-300">{listingId}</span>
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
            className="w-full border-0 rounded-lg mb-6 calendar-container"
            formatShortWeekday={(locale, date) => 
              date.toLocaleDateString('el', { weekday: 'short' }).substring(0, 3)
            }
            nextLabel="→"
            prevLabel="←"
            next2Label={null}
            prev2Label={null}
          />
          
          {selectedDate && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 dark:text-white text-gray-600">Διαθέσιμες Ώρες</h4>
              {loadingHours ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 dark:text-white text-gray-600">
                  {availableHours.map((time) => (
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
              )}
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

      {pageId === 3 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Πίσω
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Method Selection */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-4">Τρόπος Πληρωμής</h3>
              <div className="space-y-3">
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
          
          <div className="flex justify-start mt-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Πίσω
            </button>
          </div>
        </div>
      )}

      {pageId === 1 &&  (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm w-full">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Πίσω
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || !bookingData.contactInfo.name || isProcessing}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex-grow sm:flex-grow-0"
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