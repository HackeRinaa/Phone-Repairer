"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

// Extended user type to include role and id
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
  role: string;
}

// Phone listing type
interface PhoneListing {
  id: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  price: number;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
}

export default function AccountListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [listings, setListings] = useState<PhoneListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<PhoneListing | null>(null);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/listings");
    }
  }, [status, router]);
  
  useEffect(() => {
    const fetchListings = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const userId = (session.user as ExtendedUser).id;
          const response = await fetch(`/api/phone-listings?userId=${userId}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch listings");
          }
          
          const data = await response.json();
          setListings(data);
        } catch (error) {
          console.error("Error fetching listings:", error);
          toast.error("Failed to load your listings");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchListings();
  }, [session, status]);
  
  const handleDeleteListing = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την αγγελία;")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/phone-listings/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }
      
      // Remove from state
      setListings(listings.filter(listing => listing.id !== id));
      
      // Close detail view if open
      if (selectedListing?.id === id) {
        setSelectedListing(null);
      }
      
      toast.success("Η αγγελία διαγράφηκε με επιτυχία");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Σφάλμα κατά τη διαγραφή της αγγελίας");
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };
  
  // Get condition label
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "Άριστη";
      case "VeryGood":
        return "Πολύ Καλή";
      case "Good":
        return "Καλή";
      case "Fair":
        return "Μέτρια";
      default:
        return condition;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Σε αναμονή</span>;
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Εγκεκριμένη</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Απορρίφθηκε</span>;
      case "sold":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Πωλήθηκε</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </main>
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Οι Αγγελίες μου
            </h1>
            
            <Link
              href="/sell"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Νέα Αγγελία
            </Link>
          </div>
          
          {listings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="mb-4 flex justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Δεν έχετε αγγελίες ακόμα
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Πουλήστε το παλιό σας κινητό εύκολα και γρήγορα
              </p>
              <Link
                href="/sell"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Δημιουργία Αγγελίας
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* Listing detail view */}
              {selectedListing && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {selectedListing.brand} {selectedListing.model}
                      </h2>
                      <button
                        onClick={() => setSelectedListing(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Images */}
                      <div>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                          {selectedListing.images.length > 0 ? (
                            <img
                              src={selectedListing.images[0]}
                              alt={`${selectedListing.brand} ${selectedListing.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image available
                            </div>
                          )}
                        </div>
                        
                        {selectedListing.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedListing.images.slice(1).map((image, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                  src={image}
                                  alt={`${selectedListing.brand} ${selectedListing.model} ${index + 2}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Κατάσταση</h3>
                            <div className="mt-1">{getStatusBadge(selectedListing.status)}</div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Τιμή</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatPrice(selectedListing.price)}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Αποθηκευτικός Χώρος</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{selectedListing.storage}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Κατάσταση Συσκευής</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{getConditionLabel(selectedListing.condition)}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Περιγραφή</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{selectedListing.description || "Δεν υπάρχει περιγραφή"}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ημερομηνία Καταχώρησης</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">
                              {new Date(selectedListing.createdAt).toLocaleDateString("el-GR")}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="mt-8 flex space-x-4">
                          {selectedListing.status === "rejected" && (
                            <Link
                              href={`/sell/edit/${selectedListing.id}`}
                              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                              Επεξεργασία
                            </Link>
                          )}
                          
                          <button
                            onClick={() => handleDeleteListing(selectedListing.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Διαγραφή
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Listings table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Συσκευή
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Τιμή
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Κατάσταση
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ημερομηνία
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ενέργειες
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              {listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={`${listing.brand} ${listing.model}`}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {listing.brand} {listing.model}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {listing.storage} • {getConditionLabel(listing.condition)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(listing.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(listing.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(listing.createdAt).toLocaleDateString("el-GR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedListing(listing)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                          >
                            Προβολή
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Διαγραφή
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 