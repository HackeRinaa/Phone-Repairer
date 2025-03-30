"use client";

import React, { useState, useEffect } from 'react';
import { getAllImagesFromString, imagesToJsonString } from '@/lib/imageUtils';

interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  type: string; // "REPAIR" or "PRODUCT"
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PhoneListing {
  id: string;
  brand: string;
  model: string;
  price: number;
  condition: string;
  storage: string;
  description?: string;
  images: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

// Interface for phones available for sale
interface PhoneForSale {
  id: string;
  brand: string;
  model: string;
  price: number;
  condition: string;
  storage: string;
  color: string;
  description?: string;
  images: string;
  year?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [phoneListings, setPhoneListings] = useState<PhoneListing[]>([]);
  const [phonesForSale, setPhonesForSale] = useState<PhoneForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings' | 'phonesForSale'>('bookings');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  
  // Add state for phones for sale
  const [isAddingPhoneForSale, setIsAddingPhoneForSale] = useState(false);
  const [newPhoneForSale, setNewPhoneForSale] = useState({
    brand: '',
    model: '',
    price: '',
    condition: 'NEW',
    storage: '',
    color: 'Black',
    description: '',
    images: '',
    year: new Date().getFullYear()
  });
  
  // Simple admin authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // For simplicity, hardcoded credentials - in a real app, use proper authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      
      // Try to ping the admin API to establish the session
      try {
        const response = await fetch('/api/admin/ping?adminKey=admin123', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('Admin session established');
        }
      } catch (err) {
        console.warn('Could not establish admin session:', err);
      }
      
      // Fetch data after authentication
      fetchData();
    } else {
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    // Check if admin is already authenticated
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Execute all fetches in parallel but handle errors individually
      await Promise.allSettled([
        fetchBookings(),
        fetchPhoneListings(),
        fetchPhonesForSale()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // This ensures cookies are sent with the request, which is needed for session-based auth
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
      // Don't throw here, just set the error state
    }
  };

  const fetchPhoneListings = async () => {
    try {
      // First try admin API endpoint with explicit 'all' status
      console.log('Fetching phone listings from admin API...');
      const response = await fetch('/api/admin/phone-listings?status=all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.warn('Admin API failed, falling back to public endpoint');
        // Try public API with no status filter to get all listings
        const publicResponse = await fetch('/api/phone-listings?status=all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!publicResponse.ok) {
          throw new Error('Failed to fetch phone listings');
        }
        
        const data = await publicResponse.json();
        console.log('Phone listings from public API:', data.listings);
        setPhoneListings(data.listings || []);
        return;
      }
      
      const data = await response.json();
      console.log('Phone listings from admin API:', data.listings);
      setPhoneListings(data.listings || []);
    } catch (err) {
      console.error('Error fetching phone listings:', err);
      setError('Failed to fetch phone listings. Please try again.');
    }
  };

  // New function to fetch phones for sale
  const fetchPhonesForSale = async () => {
    try {
      // First try admin API endpoint
      const response = await fetch('/api/phones-for-sale?status=all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched phones for sale:', data.phones.length);
        setPhonesForSale(data.phones || []);
      } else {
        console.warn('Failed to fetch phones for sale');
        setPhonesForSale([]);
      }
    } catch (err) {
      console.error('Error fetching phones for sale:', err);
      // Don't throw error, just log it
    }
  };

  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
      
      // Refresh bookings after update
      fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleListingStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/phone-listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing status');
      }
      
      console.log(`Successfully updated listing ${id} status to ${newStatus}`);
      
      // Update the local state to reflect the change
      setPhoneListings(prevListings => 
        prevListings.map(listing => 
          listing.id === id ? { ...listing, status: newStatus } : listing
        )
      );
      
      // Set a success message
      setError(null);
    } catch (err) {
      console.error('Error updating listing status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Add a new phone listing
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [newListing, setNewListing] = useState({
    brand: '',
    model: '',
    price: '',
    condition: 'NEW',
    storage: '',
    color: 'Black',
    description: '',
    images: '',
    name: 'Admin',
    email: 'admin@example.com',
    phone: '',
    address: ''
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the images - either use the provided string or convert a comma-separated list to JSON
      let imagesValue: string | string[] = newListing.images;
      if (newListing.images && newListing.images.includes(',')) {
        imagesValue = newListing.images.split(',').map(url => url.trim());
      }
      
      const response = await fetch('/api/phone-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newListing,
          price: parseFloat(newListing.price),
          // Add color to the description for display in purchase page
          description: newListing.description ? 
            `${newListing.description}\ncolor: ${newListing.color}` : 
            `color: ${newListing.color}`,
          images: Array.isArray(imagesValue) ? JSON.stringify(imagesValue) : imagesValue,
          status: 'APPROVED' // Admin-created listings are automatically approved
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }
      
      const data = await response.json();
      console.log('Created new listing:', data.listing);
      
      // Add the new listing to our state
      setPhoneListings(prevListings => [data.listing, ...prevListings]);
      
      // Reset form and hide modal
      setNewListing({
        brand: '',
        model: '',
        price: '',
        condition: 'NEW',
        storage: '',
        color: 'Black',
        description: '',
        images: '',
        name: 'Admin',
        email: 'admin@example.com',
        phone: '',
        address: ''
      });
      setIsAddingListing(false);
      setError(null);
    } catch (err) {
      console.error('Error creating phone listing:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to extract device details from notes field
  const extractDeviceDetails = (notes: string | null | undefined): { brand: string; model: string; issues: string[] } => {
    if (!notes) {
      return { brand: "N/A", model: "N/A", issues: [] };
    }
    
    try {
      // Log the notes for debugging
      console.log('Notes to parse:', notes);
      
      // First check if it's a valid JSON string
      if (typeof notes !== 'string' || notes.trim() === '') {
        console.warn('Notes is not a valid string:', notes);
        return { brand: "N/A", model: "N/A", issues: [] };
      }
      
      // If it starts with 'test' or any non-JSON character, handle it
      if (!notes.trim().startsWith('{')) {
        console.warn('Notes does not start with {:', notes.substring(0, 20));
        return { brand: "N/A", model: "N/A", issues: [] };
      }
      
      const parsedNotes = JSON.parse(notes);
      const deviceDetails = parsedNotes.deviceDetails || {};
      
      return {
        brand: deviceDetails.brand || "N/A",
        model: deviceDetails.model || "N/A",
        issues: Array.isArray(deviceDetails.issues) ? deviceDetails.issues : []
      };
    } catch (error) {
      // If parsing fails, return default values and log the error
      console.error("Error parsing device details from notes:", error);
      console.error("Notes content causing error:", notes?.substring(0, 100));
      return { brand: "N/A", model: "N/A", issues: [] };
    }
  };

  // Helper function to parse JSON image string
  const tryParseJsonImages = (imagesString: string): string[] => {
    return getAllImagesFromString(imagesString);
  };

  // Handle phone for sale status change
  const handlePhoneForSaleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/phones-for-sale/${id}?adminKey=admin123`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update phone status');
      }
      
      console.log(`Successfully updated phone ${id} status to ${newStatus}`);
      
      // Update the local state to reflect the change
      setPhonesForSale(prevPhones => 
        prevPhones.map(phone => 
          phone.id === id ? { ...phone, status: newStatus } : phone
        )
      );
      
      // Set a success message
      setError(null);
    } catch (err) {
      console.error('Error updating phone status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Handle creating a new phone for sale
  const handleCreatePhoneForSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the images using the utility function
      const imagesJson = imagesToJsonString(
        newPhoneForSale.images ? newPhoneForSale.images.split(',').map(url => url.trim()) : []
      );
      
      const response = await fetch('/api/phones-for-sale?adminKey=admin123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newPhoneForSale,
          price: parseFloat(newPhoneForSale.price),
          images: imagesJson,
          status: 'AVAILABLE' // Admin-created phones are automatically available
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create phone for sale');
      }
      
      const data = await response.json();
      console.log('Created new phone for sale:', data.phone);
      
      // Add the new phone to our state
      setPhonesForSale(prevPhones => [data.phone, ...prevPhones]);
      
      // Reset form and hide modal
      setNewPhoneForSale({
        brand: '',
        model: '',
        price: '',
        condition: 'NEW',
        storage: '',
        color: 'Black',
        description: '',
        images: '',
        year: new Date().getFullYear()
      });
      setIsAddingPhoneForSale(false);
      setError(null);
    } catch (err) {
      console.error('Error creating phone for sale:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center dark:text-white">Admin Login</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-white">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg text-gray-600 bg-gray-300 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg text-gray-600 bg-gray-300 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-600 dark:text-white">Admin Dashboard</h1>
          <div className="flex space-x-3">
            <button
              onClick={async () => {
                if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα δεδομένα από τη βάση; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί!')) {
                  try {
                    const response = await fetch('/api/admin/reset-database?adminKey=admin123', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include'
                    });
                    
                    if (response.ok) {
                      const data = await response.json();
                      alert(`Η βάση δεδομένων καθαρίστηκε επιτυχώς!\nΔιαγράφηκαν:\n${data.deletedBookings} κρατήσεις\n${data.deletedPhoneListings} αγγελίες κινητών\n${data.deletedPhonesForSale} κινητά προς πώληση`);
                      // Refresh data
                      fetchData();
                    } else {
                      alert('Προέκυψε σφάλμα κατά τον καθαρισμό της βάσης δεδομένων');
                    }
                  } catch (err) {
                    console.error('Error resetting database:', err);
                    alert('Προέκυψε σφάλμα κατά τη σύνδεση με τον διακομιστή');
                  }
                }
              }}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Καθαρισμός Βάσης
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                setIsAuthenticated(false);
              }}
              className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex mb-6 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-gray-600 dark:text-white ${activeTab === 'bookings' ? 'border-b-2 border-purple-500 text-purple-500' : ''}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 text-gray-600 dark:text-white ${activeTab === 'listings' ? 'border-b-2 border-purple-500 text-purple-500' : ''}`}
          >
            Phone Listings
          </button>
          <button
            onClick={() => setActiveTab('phonesForSale')}
            className={`px-4 py-2 text-gray-600 dark:text-white ${activeTab === 'phonesForSale' ? 'border-b-2 border-purple-500 text-purple-500' : ''}`}
          >
            Phones For Sale
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Bookings Table */}
            {activeTab === 'bookings' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <React.Fragment key={booking.id}>
                            <tr 
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                expandedBookingId === booking.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                              }`}
                              onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-white">
                                <div>{formatDate(booking.date)}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.timeSlot}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-white">
                                <div>{booking.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.email}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.phone}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-white">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.type === 'REPAIR' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                  {booking.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-white">
                                <div>{extractDeviceDetails(booking.notes).brand} {extractDeviceDetails(booking.notes).model}</div>
                                {booking.type === 'REPAIR' && extractDeviceDetails(booking.notes).issues.length > 0 && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {extractDeviceDetails(booking.notes).issues[0]}{extractDeviceDetails(booking.notes).issues.length > 1 ? ` +${extractDeviceDetails(booking.notes).issues.length - 1} more` : ''}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-white">
                                {booking.totalAmount ? `${booking.totalAmount}€` : 'N/A'}
                                {booking.paymentStatus && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{booking.paymentStatus}</div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-600 dark:text-white ${
                                  booking.status === 'PENDING' 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                    : booking.status === 'CONFIRMED'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                      : booking.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <select
                                  value={booking.status}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="CONFIRMED">Confirmed</option>
                                  <option value="COMPLETED">Completed</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                            
                            {/* Expanded Booking Details */}
                            {expandedBookingId === booking.id && (
                              <tr>
                                <td colSpan={7} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Customer Details</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                          <p className="text-gray-900 dark:text-white">{booking.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                          <p className="text-gray-900 dark:text-white">{booking.phone}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                          <p className="text-gray-900 dark:text-white">{booking.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                          <p className="text-gray-900 dark:text-white">{formatDate(booking.createdAt)}</p>
                                        </div>
                                      </div>
                                      
                                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Address</h3>
                                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{booking.address || 'No address provided'}</p>
                                      
                                      {/* Extract user notes from JSON if available */}
                                      {(() => {
                                        try {
                                          const parsedNotes = JSON.parse(booking.notes || '{}');
                                          if (parsedNotes.userNotes && parsedNotes.userNotes.trim()) {
                                            return (
                                              <>
                                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Additional Notes</h3>
                                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{parsedNotes.userNotes}</p>
                                              </>
                                            );
                                          }
                                        } catch {
                                          // If notes can't be parsed as JSON, show the whole notes field
                                          if (booking.notes && booking.notes.trim()) {
                                            return (
                                              <>
                                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Additional Notes</h3>
                                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{booking.notes}</p>
                                              </>
                                            );
                                          }
                                        }
                                        return null;
                                      })()}
                                    </div>
                                    
                                    <div>
                                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Appointment Details</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                          <p className="text-gray-900 dark:text-white">{formatDate(booking.date)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                          <p className="text-gray-900 dark:text-white">{booking.timeSlot}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                                          <p className="text-gray-900 dark:text-white">{booking.type}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                          <p className="text-gray-900 dark:text-white">{booking.status}</p>
                                        </div>
                                      </div>
                                      
                                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Device Information</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
                                          <p className="text-gray-600 dark:text-white">{extractDeviceDetails(booking.notes).brand}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                                          <p className="text-gray-600 dark:text-white">{extractDeviceDetails(booking.notes).model}</p>
                                        </div>
                                      </div>
                                      
                                      {booking.type === 'REPAIR' && extractDeviceDetails(booking.notes).issues.length > 0 && (
                                        <>
                                          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Issues to Fix</h3>
                                          <ul className="list-disc pl-5 text-gray-600 dark:text-white">
                                            {extractDeviceDetails(booking.notes).issues.map((issue, index) => (
                                              <li key={index}>{issue}</li>
                                            ))}
                                          </ul>
                                        </>
                                      )}
                                      
                                      {booking.totalAmount && (
                                        <>
                                          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Payment Details</h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                                              <p className="text-gray-600 dark:text-white font-semibold">{booking.totalAmount}€</p>
                                            </div>
                                            {booking.paymentMethod && (
                                              <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Method</p>
                                                <p className="text-gray-600 dark:text-white">{booking.paymentMethod}</p>
                                              </div>
                                            )}
                                            {booking.paymentStatus && (
                                              <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                                <p className="text-gray-600 dark:text-white">{booking.paymentStatus}</p>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`mailto:${booking.email}?subject=Regarding Your Booking #${booking.id}`, '_blank');
                                      }}
                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2"
                                    >
                                      Email Customer
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(booking.id);
                                        alert('Booking ID copied to clipboard');
                                      }}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                      Copy Booking ID
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Phone Listings Table */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-600 dark:text-white">Phone Listings</h2>
                  <button
                    onClick={() => setIsAddingListing(true)}
                    className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add New Listing
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Condition</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Listed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {phoneListings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No phone listings found
                            </td>
                          </tr>
                        ) : (
                          phoneListings.map((listing) => (
                            <React.Fragment key={listing.id}>
                              <tr 
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                  expandedListingId === listing.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                                }`}
                                onClick={() => setExpandedListingId(expandedListingId === listing.id ? null : listing.id)}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-white">
                                  <div>{listing.brand} {listing.model}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{listing.storage}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-white">
                                  <div>{listing.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{listing.email}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{listing.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-white">
                                  {listing.price}€
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-white">
                                  {listing.condition}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-white">
                                  {formatDate(listing.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    listing.status === 'PENDING' 
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                      : listing.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : listing.status === 'SOLD'
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          : listing.status === 'NOT_AVAILABLE'
                                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {listing.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <select
                                    value={listing.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleListingStatusChange(listing.id, e.target.value)}
                                    className="block w-full py-2 px-3 border border-gray-300 text-gray-600 dark:text-white bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                                  >
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="NOT_AVAILABLE">Not Available</option>
                                    <option value="REJECTED">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                              
                              {/* Expanded Listing Details */}
                              {expandedListingId === listing.id && (
                                <tr>
                                  <td colSpan={7} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Phone Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
                                            <p className="text-gray-600 dark:text-white">{listing.brand}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                                            <p className="text-gray-600 dark:text-white">{listing.model}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Storage</p>
                                            <p className="text-gray-600 dark:text-white">{listing.storage}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                                            <p className="text-gray-600 dark:text-white">{listing.condition}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                                            <p className="text-gray-600 dark:text-white font-semibold">{listing.price}€</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                            <p className="text-gray-600 dark:text-white">{listing.status}</p>
                                          </div>
                                        </div>
                                        
                                        {listing.description && (
                                          <>
                                            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Description</h3>
                                            <p className="text-gray-600 dark:text-white whitespace-pre-wrap">{listing.description}</p>
                                          </>
                                        )}
                                        
                                        {/* Images */}
                                        {listing.images && (
                                          <>
                                            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Images</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                              {tryParseJsonImages(listing.images).map((image: string, index: number) => (
                                                <div key={index} className="h-24 w-full rounded-lg overflow-hidden">
                                                  <img 
                                                    src={image} 
                                                    alt={`${listing.brand} ${listing.model} - ${index + 1}`} 
                                                    className="w-full h-full object-cover"
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      
                                      <div>
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Seller Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                            <p className="text-gray-600 dark:text-white">{listing.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-gray-600 dark:text-white">{listing.email}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="text-gray-600 dark:text-white">{listing.phone}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Listed On</p>
                                            <p className="text-gray-600 dark:text-white">{formatDate(listing.createdAt)}</p>
                                          </div>
                                        </div>
                                        
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-3">Address</h3>
                                        <p className="text-gray-600 dark:text-white whitespace-pre-wrap">{listing.address || 'No address provided'}</p>
                                        
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Add New Listing Modal */}
                {isAddingListing && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-white">Add New Phone Listing</h3>
                        <button
                          onClick={() => setIsAddingListing(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <form onSubmit={handleCreateListing} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Brand</label>
                            <input
                              type="text"
                              value={newListing.brand}
                              onChange={(e) => setNewListing({...newListing, brand: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Model</label>
                            <input
                              type="text"
                              value={newListing.model}
                              onChange={(e) => setNewListing({...newListing, model: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Price (€)</label>
                            <input
                              type="number"
                              value={newListing.price}
                              onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              min="1"
                              step="0.01"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Storage</label>
                            <input
                              type="text"
                              value={newListing.storage}
                              onChange={(e) => setNewListing({...newListing, storage: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              placeholder="e.g. 128GB"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Condition</label>
                            <select
                              value={newListing.condition}
                              onChange={(e) => setNewListing({...newListing, condition: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            >
                              <option value="NEW">New</option>
                              <option value="LIKE_NEW">Like New</option>
                              <option value="GOOD">Good</option>
                              <option value="FAIR">Fair</option>
                              <option value="POOR">Poor</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Color</label>
                            <select
                              value={newListing.color}
                              onChange={(e) => setNewListing({...newListing, color: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            >
                              <option value="Black">Black</option>
                              <option value="White">White</option>
                              <option value="Silver">Silver</option>
                              <option value="Gold">Gold</option>
                              <option value="Blue">Blue</option>
                              <option value="Red">Red</option>
                              <option value="Green">Green</option>
                              <option value="Yellow">Yellow</option>
                              <option value="Purple">Purple</option>
                              <option value="Pink">Pink</option>
                              <option value="Gray">Gray</option>
                              <option value="Space Gray">Space Gray</option>
                              <option value="Midnight">Midnight</option>
                              <option value="Starlight">Starlight</option>
                              <option value="Product Red">Product Red</option>
                              <option value="Sierra Blue">Sierra Blue</option>
                              <option value="Rose Gold">Rose Gold</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Images URLs</label>
                          <input
                            type="text"
                            value={newListing.images}
                            onChange={(e) => setNewListing({...newListing, images: e.target.value})}
                            className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            placeholder="Single URL or comma-separated for multiple"
                          />
                          <p className="text-xs text-gray-500 mt-1">For multiple images, enter comma-separated URLs or JSON array</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Description</label>
                          <textarea
                            value={newListing.description}
                            onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                            className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            rows={4}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Contact Phone</label>
                            <input
                              type="text"
                              value={newListing.phone}
                              onChange={(e) => setNewListing({...newListing, phone: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Contact Address</label>
                            <input
                              type="text"
                              value={newListing.address}
                              onChange={(e) => setNewListing({...newListing, address: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsAddingListing(false)}
                            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Create Listing
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Phones For Sale Tab Content */}
            {activeTab === 'phonesForSale' && (
              <div className="shadow-md bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-600 dark:text-white">Phones For Sale</h2>
                  <button
                    onClick={() => setIsAddingPhoneForSale(true)}
                    className="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded"
                  >
                    Add New Phone
                  </button>
                </div>
                
                {/* Add New Phone Modal */}
                {isAddingPhoneForSale && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
                      <h3 className="text-xl font-bold mb-4 text-center text-gray-600 dark:text-white">Add New Phone For Sale</h3>
                      <form onSubmit={handleCreatePhoneForSale}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Brand</label>
                            <input
                              type="text"
                              value={newPhoneForSale.brand}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, brand: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Model</label>
                            <input
                              type="text"
                              value={newPhoneForSale.model}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, model: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Price (€)</label>
                            <input
                              type="number"
                              value={newPhoneForSale.price}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, price: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              min="1"
                              step="0.01"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Storage</label>
                            <input
                              type="text"
                              value={newPhoneForSale.storage}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, storage: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              placeholder="e.g. 128GB"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Condition</label>
                            <select
                              value={newPhoneForSale.condition}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, condition: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            >
                              <option value="NEW">New</option>
                              <option value="LIKE_NEW">Like New</option>
                              <option value="GOOD">Good</option>
                              <option value="FAIR">Fair</option>
                              <option value="POOR">Poor</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Color</label>
                            <select
                              value={newPhoneForSale.color}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, color: e.target.value})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              required
                            >
                              <option value="Black">Black</option>
                              <option value="White">White</option>
                              <option value="Silver">Silver</option>
                              <option value="Gold">Gold</option>
                              <option value="Blue">Blue</option>
                              <option value="Red">Red</option>
                              <option value="Green">Green</option>
                              <option value="Yellow">Yellow</option>
                              <option value="Purple">Purple</option>
                              <option value="Pink">Pink</option>
                              <option value="Gray">Gray</option>
                              <option value="Space Gray">Space Gray</option>
                              <option value="Midnight">Midnight</option>
                              <option value="Starlight">Starlight</option>
                              <option value="Product Red">Product Red</option>
                              <option value="Sierra Blue">Sierra Blue</option>
                              <option value="Rose Gold">Rose Gold</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Year</label>
                            <input
                              type="number"
                              value={newPhoneForSale.year}
                              onChange={(e) => setNewPhoneForSale({...newPhoneForSale, year: parseInt(e.target.value)})}
                              className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                              min="2010"
                              max={new Date().getFullYear()}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Images URLs</label>
                          <input
                            type="text"
                            value={newPhoneForSale.images}
                            onChange={(e) => setNewPhoneForSale({...newPhoneForSale, images: e.target.value})}
                            className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            placeholder="Single URL or comma-separated for multiple"
                          />
                          <p className="text-xs text-gray-500 mt-1">For multiple images, enter comma-separated URLs</p>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">Description</label>
                          <textarea
                            value={newPhoneForSale.description}
                            onChange={(e) => setNewPhoneForSale({...newPhoneForSale, description: e.target.value})}
                            className="w-full p-2 border rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setIsAddingPhoneForSale(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 dark:text-white bg-gray-300 dark:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                          >
                            Save Phone
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Phones For Sale List */}
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {phonesForSale.length > 0 ? (
                        phonesForSale.map((phone) => (
                          <tr key={phone.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {phone.brand} {phone.model} ({phone.year})
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{phone.price}€</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <p>Condition: {phone.condition}</p>
                                <p>Storage: {phone.storage}</p>
                                <p>Color: {phone.color}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${phone.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                  phone.status === 'SOLD' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}
                              >
                                {phone.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {phone.status !== 'AVAILABLE' && (
                                  <button
                                    onClick={() => handlePhoneForSaleStatusChange(phone.id, 'AVAILABLE')}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600"
                                  >
                                    Mark Available
                                  </button>
                                )}
                                {phone.status !== 'SOLD' && (
                                  <button
                                    onClick={() => handlePhoneForSaleStatusChange(phone.id, 'SOLD')}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                                  >
                                    Mark Sold
                                  </button>
                                )}
                                {phone.status !== 'NOT_AVAILABLE' && (
                                  <button
                                    onClick={() => handlePhoneForSaleStatusChange(phone.id, 'NOT_AVAILABLE')}
                                    className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-600"
                                  >
                                    Mark Unavailable
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No phones for sale found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 