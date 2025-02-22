"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { PaymentSection } from "@/components/PaymentSection";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!showPayment ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">Πιστοποιημένα Ανακατασκευασμένα Κινητά</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ελεγμένες συσκευές με εγγύηση σε προσιτές τιμές
              </p>
            </div>

            {/* Horizontal Filters */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Μάρκα</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full p-2 rounded border dark:bg-gray-700"
                >
                  <option value="all">Όλες οι Μάρκες</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Εύρος Τιμής</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [Number(e.target.value), filters.priceRange[1]]
                    })}
                    className="w-full p-2 rounded border dark:bg-gray-700"
                  />
                  <span>έως</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })}
                    className="w-full p-2 rounded border dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Κατάσταση</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full p-2 rounded border dark:bg-gray-700"
                >
                  <option value="all">Όλες οι Καταστάσεις</option>
                  <option value="Excellent">Άριστη</option>
                  <option value="Very Good">Πολύ Καλή</option>
                  <option value="Good">Καλή</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  brand: "all",
                  priceRange: [0, 2000],
                  condition: "all",
                  storage: "all"
                })}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Επαναφορά Φίλτρων
              </button>
            </div>

            {/* Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhones.map((phone) => (
                <div key={phone.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={phone.image}
                      alt={`${phone.brand} ${phone.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{phone.brand} {phone.model}</h3>
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
                      className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                title: `${selectedPhone?.brand} ${selectedPhone?.model}`,
                price: selectedPhone?.price || 0
              }
            ]}
            onComplete={(data) => {
              console.log('Η παραγγελία ολοκληρώθηκε:', data);
              // Handle completion
            }}
          />
        )}
      </main>
    </div>
  );
} 