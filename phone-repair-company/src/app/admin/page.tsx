"use client";

import React, { useState, useEffect } from 'react';

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
  description: string;
  images: string; // JSON string of image URLs
  status: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [phoneListings, setPhoneListings] = useState<PhoneListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings'>('bookings');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  
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
      
      // Execute both fetches in parallel but handle errors individually
      await Promise.allSettled([
        fetchBookings(),
        fetchPhoneListings()
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
        throw new Error('Failed to update listing status');
      }
      
      // Refresh listings after update
      fetchPhoneListings();
    } catch (err) {
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
      const parsedNotes = JSON.parse(notes);
      const deviceDetails = parsedNotes.deviceDetails || {};
      
      return {
        brand: deviceDetails.brand || "N/A",
        model: deviceDetails.model || "N/A",
        issues: Array.isArray(deviceDetails.issues) ? deviceDetails.issues : []
      };
    } catch (error) {
      // If parsing fails, return default values
      console.error("Error parsing device details from notes:", error);
      return { brand: "N/A", model: "N/A", issues: [] };
    }
  };

  // Helper function to parse JSON image string
  const tryParseJsonImages = (imagesString: string): string[] => {
    try {
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If it's not a valid JSON string, check if it's a single URL
      return imagesString ? [imagesString] : [];
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
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === 'bookings'
                    ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-500 dark:border-purple-500'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Bookings
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('listings')}
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === 'listings'
                    ? 'text-purple-600 border-b-2 border-purple-600 dark:text-purple-500 dark:border-purple-500'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Phone Listings
              </button>
            </li>
          </ul>
        </div>
        
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
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="APPROVED">Approved</option>
                                  <option value="SOLD">Sold</option>
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
                                      
                                      <div className="mt-6">
                                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Actions</h3>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                          {listing.status === 'PENDING' && (
                                            <>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleListingStatusChange(listing.id, 'APPROVED');
                                                }}
                                                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                              >
                                                Approve
                                              </button>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleListingStatusChange(listing.id, 'REJECTED');
                                                }}
                                                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                              >
                                                Reject
                                              </button>
                                            </>
                                          )}
                                          
                                          {listing.status === 'APPROVED' && (
                                            <>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleListingStatusChange(listing.id, 'SOLD');
                                                }}
                                                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                              >
                                                Mark as Sold
                                              </button>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleListingStatusChange(listing.id, 'REJECTED');
                                                }}
                                                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                              >
                                                Reject
                                              </button>
                                            </>
                                          )}
                                          
                                          {(listing.status === 'REJECTED' || listing.status === 'SOLD') && (
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleListingStatusChange(listing.id, 'APPROVED');
                                              }}
                                              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors col-span-2"
                                            >
                                              Reactivate
                                            </button>
                                          )}
                                        </div>
                                      </div>
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
            )}
          </>
        )}
      </div>
    </div>
  );
} 