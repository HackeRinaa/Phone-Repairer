"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { PaymentSection } from "@/components/PaymentSection";
import Link from "next/link";

interface PhoneProduct {
  id: string;
  brand: string;
  model: string;
  price: number;
  condition: string;
  storage: string;
  color: string;
  image: string;
  year: number;
}

export default function PurchasePage() {
  const [ showPayment, setShowPayment ] = useState( false );
  const [ selectedPhone, setSelectedPhone ] = useState<PhoneProduct | null>( null );
  const [ filters, setFilters ] = useState( {
    brand: "all",
    priceRange: [ 0, 2000 ],
    condition: "all",
    storage: "all",
    sort: "newest", // Add this line
  } );


  // Set pageId to 2 for payment functionality
  const pageId = 2;

  const phones: PhoneProduct[] = [
    {
      id: "1",
      brand: "Apple",
      model: "iPhone 13 Pro",
      price: 699,
      condition: "Excellent",
      storage: "128GB",
      color: "Graphite",
      image: "/phones/iphone-13-pro.jpg",
      year: 2021
    },
    {
      id: "2",
      brand: "Apple",
      model: "iPhone 14 Pro",
      price: 899,
      condition: "Excellent",
      storage: "128GB",
      color: "Graphite",
      image: "/phones/iphone-14-pro.jpg",
      year: 2024
    },
    {
      id: "3",
      brand: "Apple",
      model: "iPhone 12",
      price: 699,
      condition: "Excellent",
      storage: "128GB",
      color: "Graphite",
      image: "/phones/iphone-12.jpg",
      year: 2024
    },
  ];



  const sortedPhones = phones
    .filter((phone) => {
      if (filters.brand !== "all" && phone.brand !== filters.brand) return false;
      if (phone.price < filters.priceRange[0] || phone.price > filters.priceRange[1]) return false;
      if (filters.condition !== "all" && phone.condition !== filters.condition) return false;
      if (filters.storage !== "all" && phone.storage !== filters.storage) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return b.year - a.year; // Sort by newest first
        case "priceAsc":
          return a.price - b.price; // Sort by price ascending
        case "priceDesc":
          return b.price - a.price; // Sort by price descending
        default:
          return 0;
      }
    });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      sort: e.target.value,
    });
  };

  const handleBuyClick = ( phone: PhoneProduct ) => {
    setSelectedPhone( phone );
    setShowPayment( true );
  };

  const [ showFilters, setShowFilters ] = useState( false );
  
  const [viewColumns, setViewColumns] = useState(3);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        {!showPayment ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                Μεταχειρισμένα Κινητά
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ελεγμένες συσκευές με εγγύηση σε προσιτές τιμές
              </p>
            </div>

            {/* Responsive Filters */}
            <div className="shadow-md bg-white dark:bg-gray-800 p-6 rounded-xl mb-8">
              {/* Small screen buttons */}
              <div className="flex sm:hidden justify-between">
                <button
                  onClick={() => setShowFilters( !showFilters )}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  Φίλτρα
                </button>
                <button
                  onClick={() => setViewColumns( viewColumns === 1 ? 2 : viewColumns === 2 ? 3 : 1 )}
                  className="py-2"
                >
                  Προβολή <span className="text-purple-600 font-bold px-1 text-lg">{viewColumns}</span>
                </button>
              </div>

              {/* Filters (hidden on small screens unless expanded) */}
              <div className={`grid gap-4 ${showFilters ? "grid-cols-1" : "hidden"} sm:grid sm:grid-cols-2 lg:grid-cols-4 mt-4`}>

                {/* Brand Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Μάρκα</label>
                  <select
                    value={filters.brand}
                    onChange={( e ) => setFilters( { ...filters, brand: e.target.value } )}
                    className="w-full p-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <option value="all">Όλες οι Μάρκες</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                  </select>
                </div>

                {/* Sort by Price/Newest */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Ταξινόμηση</label>
                  <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="w-full p-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <option value="newest">Νεότερα</option>
                    <option value="priceAsc">Τιμή (Αύξουσα)</option>
                    <option value="priceDesc">Τιμή (Φθίνουσα)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Εύρος Τιμής</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={filters.priceRange[ 0 ]}
                      onChange={( e ) =>
                        setFilters( { ...filters, priceRange: [ Number( e.target.value ), filters.priceRange[ 1 ] ] } )
                      }
                      className="w-full p-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    />
                    <span className="text-gray-600 dark:text-gray-400">έως</span>
                    <input
                      type="number"
                      value={filters.priceRange[ 1 ]}
                      onChange={( e ) =>
                        setFilters( { ...filters, priceRange: [ filters.priceRange[ 0 ], Number( e.target.value ) ] } )
                      }
                      className="w-full p-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    />
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end justify-between gap-2">
                  <button
                    onClick={() =>
                      setFilters( { brand: "all", priceRange: [ 0, 2000 ], condition: "all", storage: "all", sort: "newest" } )
                    }
                    className="px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg dark:text-purple-400 dark:hover:bg-purple-700 border rounded-lg border-purple-600"
                  >
                    Επαναφορά Φίλτρων
                  </button>
                  <button
                  onClick={() => setViewColumns( viewColumns === 1 ? 2 : viewColumns === 2 ? 3 : 1 )}
                  className="py-2"
                >
                  Προβολή <span className="text-purple-600 font-bold px-1 text-lg">{viewColumns}</span>
                </button>
                </div>
              </div>
            </div>


            {/* Phone Grid */}
            <div className={`grid  grid-cols-${Math.min(viewColumns, 2)} md:grid-cols-${viewColumns} gap-6`}>
              {sortedPhones.map( ( phone ) => (
                <div key={phone.id} className="shadow-md bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={phone.image}
                    alt={`${phone.brand} ${phone.model}`}
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                    {phone.brand} {phone.model}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-xl font-bold mb-2">
                    {phone.price}€
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                    <p>Κατάσταση: {phone.condition}</p>
                    <p>Αποθηκευτικός Χώρος: {phone.storage}</p>
                    <p>Χρώμα: {phone.color}</p>
                  </div>
                  <button
                    onClick={() => handleBuyClick(phone)}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Αγορά
                  </button>
                </div>
              </div>
              
              ) )}
            </div>
          </>
        ) : (
          <PaymentSection
            totalAmount={selectedPhone?.price || 0}
            itemDetails={[
              {
                title: `${selectedPhone?.brand} ${selectedPhone?.model} - purchase`,
                price: selectedPhone?.price || 0
              }
            ]}
            onComplete={( data ) => {
              console.log( 'Η παραγγελία ολοκληρώθηκε:', {
                device: {
                  brand: selectedPhone?.brand,
                  model: selectedPhone?.model
                },
                issues: 'purchase',
                orderDetails: {
                  condition: selectedPhone?.condition,
                  storage: selectedPhone?.storage,
                  price: selectedPhone?.price
                },
                booking: data
              } );
              // Handle completion
            }}
            pageId={pageId} // Pass pageId === 2 to PaymentSection
          />
        )}
      </main>
      {/* Footer - add slight transparency */}
      <footer className="py-5 flex items-center justify-center gap-8 text-sm text-gray-700 dark:text-gray-400 border-t border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Πολιτική Απορρήτου & Όροι Χρήσης</Link>
        <Link href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">Συχνές Ερωτήσεις</Link>
      </footer>
    </div>
  );
}