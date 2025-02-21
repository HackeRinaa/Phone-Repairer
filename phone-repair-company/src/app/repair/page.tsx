"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Calendar from 'react-calendar';
import { loadStripe } from '@stripe/stripe-js';
import 'react-calendar/dist/Calendar.css';
import { PaymentSection } from "@/components/PaymentSection";

const phoneOptions = {
  Apple: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13", "iPhone 12", "iPhone 11"],
  Samsung: ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22", "Galaxy S21", "Galaxy A53"],
  Google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6 Pro", "Pixel 6", "Pixel 5"],
  OnePlus: ["11 5G", "10 Pro", "10T", "Nord N300"],
};

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: 'online' | 'instore';
}

export default function RepairPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'online'
  });

  const commonIssues = [
    { title: "Screen Repair", icon: "🔧", price: "from $89" },
    { title: "Battery Replacement", icon: "🔋", price: "from $49" },
    { title: "Water Damage", icon: "💧", price: "from $99" },
    { title: "Camera Fix", icon: "📸", price: "from $69" },
  ];

  const calculateTotal = () => {
    return selectedIssues.reduce((total, issue) => {
      const issuePrice = commonIssues.find(i => i.title === issue)?.price || "0";
      return total + parseInt(issuePrice.replace(/\D/g, ''));
    }, 0);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setStep(2);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setStep(3);
  };

  const handleIssueSelect = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedIssues,
          brand: selectedBrand,
          model: selectedModel,
        }),
      });

      const { clientSecret } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
      
      if (stripe) {
        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            payment_method: 'card',
            return_url: `${window.location.origin}/repair/confirmation`,
          },
        });

        if (result.error) {
          console.error(result.error);
        } else {
          console.log('Payment successful');
        }
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-16">
            {Object.keys(phoneOptions).map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105"
              >
                <Image
                  src={`/brands/${brand.toLowerCase()}.svg`}
                  alt={brand}
                  width={48}
                  height={48}
                  className="mb-3"
                />
                <span className="text-sm font-medium">{brand}</span>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Model</h2>
            <div className="grid grid-cols-2 gap-4">
              {phoneOptions[selectedBrand as keyof typeof phoneOptions].map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all text-left hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  {model}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-blue-600 hover:text-blue-800"
            >
              ← Back to brands
            </button>
          </div>
        );

      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              What&apos;s wrong with your {selectedBrand} {selectedModel}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {commonIssues.map((issue) => (
                <button
                  key={issue.title}
                  onClick={() => handleIssueSelect(issue.title)}
                  className={`p-6 rounded-xl text-left transition-all ${
                    selectedIssues.includes(issue.title)
                      ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                      : "bg-white dark:bg-gray-800 hover:shadow-md"
                  }`}
                >
                  <span className="text-3xl mb-4 block">{issue.icon}</span>
                  <h3 className="font-medium mb-2">{issue.title}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{issue.price}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to models
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={selectedIssues.length === 0}
                className={`px-8 py-3 rounded-lg ${
                  selectedIssues.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Booking →
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <PaymentSection
            totalAmount={calculateTotal()}
            itemDetails={selectedIssues.map(issue => ({
              title: `${selectedBrand} ${selectedModel} - ${issue}`,
              price: parseInt(commonIssues.find(i => i.title === issue)?.price.replace(/\D/g, '') || "0")
            }))}
            onComplete={(data) => {
              console.log('Repair booking completed:', {
                device: { brand: selectedBrand, model: selectedModel },
                issues: selectedIssues,
                booking: data
              });
              // Handle completion - redirect or show confirmation
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">What phone needs repair?</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select your phone brand to get started
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {["Brand", "Model", "Issues", "Book"].map((label, index) => (
              <div
                key={label}
                className={`text-sm ${
                  step > index
                    ? "text-blue-600"
                    : step === index + 1
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}
      </main>
    </div>
  );
}