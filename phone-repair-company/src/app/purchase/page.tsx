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
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneProduct | null>(null);
  const [filters, setFilters] = useState({
    brand: "all",
    priceRange: [0, 2000],
    condition: "all",
    storage: "all"
  });

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

  const filteredPhones = phones.filter(phone => {
    if (filters.brand !== "all" && phone.brand !== filters.brand) return false;
    if (phone.price < filters.priceRange[0] || phone.price > filters.priceRange[1]) return false;
    if (filters.condition !== "all" && phone.condition !== filters.condition) return false;
    if (filters.storage !== "all" && phone.storage !== filters.storage) return false;
    return true;
  });

  const handleBuyClick = (phone: PhoneProduct) => {
    setSelectedPhone(phone);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!showPayment ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                Ανακατασκευασμένα Κινητά
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ελεγμένες συσκευές με εγγύηση σε προσιτές τιμές
              </p>
            </div>

            {/* Horizontal Filters */}
            <div className="shadow-md bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 flex flex-wrap gap-4 items-end shadow-sm">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Μάρκα</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full p-2 rounded border border-gray-600 dark:border-white dark:bg-gray-600  text-gray-600 dark:text-gray-400"
                >
                  <option className='text-gray-600 dark:text-gray-400' value="all">Όλες οι Μάρκες</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Apple">Apple</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Samsung">Samsung</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Google">Google</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Εύρος Τιμής</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [Number(e.target.value), filters.priceRange[1]]
                    })}
                    className="w-full p-2 rounded border dark:border-white border-gray-600 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                  <span className="text-gray-600 dark:text-gray-400">έως</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })}
                    className="w-full p-2 rounded border dark:border-white border-gray-600 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Κατάσταση</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full p-2 rounded border dark:border-white border-gray-600 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <option className='text-gray-600 dark:text-gray-400' value="all">Όλες οι Καταστάσεις</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Excellent">Άριστη</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Very Good">Πολύ Καλή</option>
                  <option className='text-gray-600 dark:text-gray-400' value="Good">Καλή</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  brand: "all",
                  priceRange: [0, 2000],
                  condition: "all",
                  storage: "all"
                })}
                className="px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg dark:text-purple-400 dark:hover:bg-purple-700"
              >
                Επαναφορά Φίλτρων
              </button>
            </div>

            {/* Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhones.map((phone) => (
                <div key={phone.id} className="shadow-md bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={phone.image}
                      alt={`${phone.brand} ${phone.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                      {phone.brand} {phone.model}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-xl font-bold mb-2">
                      {phone.price}€
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
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
              ))}
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
            onComplete={(data) => {
              console.log('Η παραγγελία ολοκληρώθηκε:', {
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
              });
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