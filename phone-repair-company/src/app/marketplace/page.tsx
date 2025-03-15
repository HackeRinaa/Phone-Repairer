"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Filter options
interface FilterOptions {
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
  condition: string;
  storage: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<PhoneListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<PhoneListing | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    brand: "",
    minPrice: null,
    maxPrice: null,
    condition: "",
    storage: "",
  });
  
  // Available filter options (derived from listings)
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);
  
  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        queryParams.append("status", "approved"); // Only show approved listings
        
        if (filters.brand) {
          queryParams.append("brand", filters.brand);
        }
        
        if (filters.minPrice !== null) {
          queryParams.append("minPrice", filters.minPrice.toString());
        }
        
        if (filters.maxPrice !== null) {
          queryParams.append("maxPrice", filters.maxPrice.toString());
        }
        
        const response = await fetch(`/api/phone-listings?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        
        const data = await response.json();
        setListings(data);
        
        // Extract available filter options
        const brands = [...new Set(data.map((listing: PhoneListing) => listing.brand))] as string[];
        const conditions = [...new Set(data.map((listing: PhoneListing) => listing.condition))] as string[];
        const storages = [...new Set(data.map((listing: PhoneListing) => listing.storage))] as string[];
        
        setAvailableBrands(brands);
        setAvailableConditions(conditions);
        setAvailableStorage(storages);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (name: keyof FilterOptions, value: string | number | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      brand: "",
      minPrice: null,
      maxPrice: null,
      condition: "",
      storage: "",
    });
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
  
  // View listing details
  const viewListingDetails = (listing: PhoneListing) => {
    setSelectedListing(listing);
    // In a real app, you might want to update the URL
    // router.push(`/marketplace/${listing.id}`, { scroll: false });
  };
  
  // Close listing details
  const closeListingDetails = () => {
    setSelectedListing(null);
    // In a real app, you might want to update the URL
    // router.push("/marketplace", { scroll: false });
  };
  
  // Contact seller
  const contactSeller = (listing: PhoneListing) => {
    // In a real app, you might implement a messaging system
    // For now, just open an email client
    window.location.href = `mailto:${listing.user.email}?subject=Ενδιαφέρομαι για το ${listing.brand} ${listing.model}&body=Γεια σας, ενδιαφέρομαι για το ${listing.brand} ${listing.model} που έχετε αναρτήσει στην αγγελία με ID: ${listing.id}.`;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Αγορά Μεταχειρισμένων Κινητών</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Φίλτρα</h2>
              
              <div className="space-y-6">
                {/* Brand filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Μάρκα
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange("brand", e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="">Όλες οι μάρκες</option>
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Price range filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Εύρος Τιμής
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        placeholder="Από"
                        value={filters.minPrice !== null ? filters.minPrice : ""}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Έως"
                        value={filters.maxPrice !== null ? filters.maxPrice : ""}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Condition filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Κατάσταση
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange("condition", e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="">Όλες οι καταστάσεις</option>
                    {availableConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {getConditionLabel(condition)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Storage filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Αποθηκευτικός Χώρος
                  </label>
                  <select
                    value={filters.storage}
                    onChange={(e) => handleFilterChange("storage", e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <option value="">Όλοι οι αποθηκευτικοί χώροι</option>
                    {availableStorage.map((storage) => (
                      <option key={storage} value={storage}>
                        {storage}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Reset filters button */}
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Καθαρισμός Φίλτρων
                </button>
                
                {/* Sell your phone button */}
                <Link
                  href="/sell"
                  className="block w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-center"
                >
                  Πούλησε το Κινητό σου
                </Link>
              </div>
            </div>
          </div>
          
          {/* Listings grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Δεν βρέθηκαν κινητά με τα επιλεγμένα φίλτρα.</p>
                <button
                  onClick={resetFilters}
                  className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Καθαρισμός Φίλτρων
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => viewListingDetails(listing)}
                  >
                    <div className="aspect-square relative">
                      {listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={`${listing.brand} ${listing.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {listing.brand} {listing.model}
                      </h3>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {listing.storage}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Κατάσταση: {getConditionLabel(listing.condition)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Listing detail modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedListing.brand} {selectedListing.model}
                </h2>
                <button
                  onClick={closeListingDetails}
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
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
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
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Τιμή</h3>
                      <p className="mt-1 text-2xl font-semibold text-purple-600 dark:text-purple-400">
                        {formatPrice(selectedListing.price)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Αποθηκευτικός Χώρος</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{selectedListing.storage}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Κατάσταση</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{getConditionLabel(selectedListing.condition)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Περιγραφή</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedListing.description || "Δεν υπάρχει περιγραφή για αυτό το προϊόν."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Πωλητής</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{selectedListing.user.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ημερομηνία Καταχώρησης</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {new Date(selectedListing.createdAt).toLocaleDateString("el-GR")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-8 flex flex-col space-y-4">
                    <button
                      onClick={() => contactSeller(selectedListing)}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Επικοινωνία με τον Πωλητή
                    </button>
                    
                    <Link
                      href={`/marketplace/buy/${selectedListing.id}`}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Αγορά Τώρα
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="py-5 flex items-center justify-center gap-8 text-sm text-gray-700 dark:text-gray-400 border-t border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Πολιτική Απορρήτου & Όροι Χρήσης</Link>
        <Link href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">Συχνές Ερωτήσεις</Link>
      </footer>
    </div>
  );
} 