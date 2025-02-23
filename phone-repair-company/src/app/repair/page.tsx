"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import 'react-calendar/dist/Calendar.css';
import { PaymentSection } from "@/components/PaymentSection";

const phoneOptions = {
  Apple: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13", "iPhone 12", "iPhone 11"],
  Samsung: ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22", "Galaxy S21", "Galaxy A53"],
  Google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6 Pro", "Pixel 6", "Pixel 5"],
  OnePlus: ["11 5G", "10 Pro", "10T", "Nord N300"],
};


const commonIssues = [
  { title: "Επισκευή Οθόνης", icon: "🔧", price: "από 89€" },
  { title: "Αντικατάσταση Μπαταρίας", icon: "🔋", price: "από 49€" },
  { title: "Βλάβη από Νερό", icon: "💧", price: "από 99€" },
  { title: "Επισκευή Κάμερας", icon: "📸", price: "από 69€" },
];

export default function RepairPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16">
            {Object.keys(phoneOptions).map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105"
              >
                <Image
                  src={`/brands/${brand.toLowerCase()}.svg`}
                  alt={brand}
                  width={48}
                  height={48}
                  className="mb-3"
                />
                <span className="text-sm font-medium text-center">{brand}</span>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Επιλέξτε το Μοντέλο σας</h2>
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
              ← Πίσω στις μάρκες
            </button>
          </div>
        );

      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Τι πρόβλημα έχει το {selectedBrand} {selectedModel} σας;
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
                ← Πίσω στα μοντέλα
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
                Συνέχεια στην Κράτηση →
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
              console.log('Η κράτηση ολοκληρώθηκε:', {
                device: { brand: selectedBrand, model: selectedModel },
                issues: selectedIssues,
                booking: data
              });
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
          <h1 className="text-4xl font-bold mb-4">Ποιο κινητό θέλετε να επισκευάσετε;</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Επιλέξτε τη μάρκα του κινητού σας για να ξεκινήσετε
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {["Μάρκα", "Μοντέλο", "Βλάβες", "Κράτηση"].map((label, index) => (
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