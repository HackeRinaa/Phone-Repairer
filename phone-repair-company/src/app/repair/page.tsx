"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "react-calendar/dist/Calendar.css";
import { PaymentSection } from "@/components/PaymentSection";
import Link from "next/link";

const phoneOptions = {
  Apple: [
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone SE (2022)",
    "iPhone SE (2020)",
  ],
  Samsung: [
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy Z Fold 5",
    "Galaxy Z Flip 5",
    "Galaxy Z Fold 4",
    "Galaxy Z Flip 4",
    "Galaxy A54",
    "Galaxy A34",
    "Galaxy A14",
    "Galaxy M54",
    "Galaxy M34",
  ],
  Google: [
    "Pixel 8 Pro",
    "Pixel 8",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6 Pro",
    "Pixel 6",
    "Pixel 5",
    "Pixel 4a",
    "Pixel 4 XL",
    "Pixel 4",
  ],
  Huawei: [
    "Mate 60 Pro",
    "Mate 50 Pro",
    "Mate 40 Pro",
    "P60 Pro",
    "P50 Pro",
    "P40 Pro",
    "Nova 11",
    "Nova 10",
    "Nova 9",
  ],
  Xiaomi: [
    "Mi 13 Pro",
    "Mi 13",
    "Mi 12 Pro",
    "Mi 12",
    "Redmi Note 12 Pro",
    "Redmi Note 12",
    "Redmi Note 11",
    "Poco F5",
    "Poco X5 Pro",
    "Poco X5",
  ],
  OnePlus: [
    "11 5G",
    "10 Pro",
    "10T",
    "Nord 3",
    "Nord CE 3",
    "Nord N30",
    "Nord N20",
  ],
  Oppo: [
    "Find X6 Pro",
    "Find X5 Pro",
    "Find X3 Pro",
    "Reno 10 Pro",
    "Reno 9 Pro",
    "Reno 8 Pro",
    "A98",
    "A78",
    "A58",
  ],
  Vivo: [
    "X90 Pro",
    "X80 Pro",
    "X70 Pro",
    "V29 Pro",
    "V27 Pro",
    "V25 Pro",
    "iQOO 11",
    "iQOO 9",
    "iQOO 7",
  ],
  Sony: [
    "Xperia 1 V",
    "Xperia 5 V",
    "Xperia 10 V",
    "Xperia 1 IV",
    "Xperia 5 IV",
    "Xperia 10 IV",
  ],
  Motorola: [
    "Moto Edge 40 Pro",
    "Moto Edge 40",
    "Moto Edge 30 Ultra",
    "Moto Edge 30",
    "Moto G84",
    "Moto G73",
    "Moto G53",
  ],
  Nokia: [
    "G60",
    "X30",
    "X20",
    "G50",
    "G21",
    "G11",
    "C32",
    "C22",
    "C12",
  ],
  Asus: [
    "ROG Phone 7",
    "ROG Phone 6",
    "Zenfone 10",
    "Zenfone 9",
    "Zenfone 8",
    "Zenfone 7 Pro",
  ],
  Lenovo: [
    "Legion Y90",
    "Legion Duel 2",
    "K14 Plus",
    "K13 Pro",
    "K12 Pro",
    "K11",
  ],
};

const commonIssues = [
  { title: "Επισκευή Οθόνης", icon: "🔧", price: "από 89€" },
  { title: "Αντικατάσταση Μπαταρίας", icon: "🔋", price: "από 49€" },
  { title: "Βλάβη από Νερό", icon: "💧", price: "από 99€" },
  { title: "Επισκευή Κάμερας", icon: "📸", price: "από 69€" },
  { title: "Επισκευή Μικροφώνου / Ηχείου", icon: "🎙️", price: "από 69€" },
];

// Step titles and descriptions
const stepTitles: Record<number,string> = {
  1: "Ποιο κινητό θέλετε να επισκευάσετε;",
  2: "Επιλέξτε το Μοντέλο σας",
  3: "Τι πρόβλημα έχει το κινητό σας;",
  4: "Ολοκληρώστε την Κράτηση",
};

const stepDescriptions: Record<number,string> = {
  1: "Επιλέξτε την εταιρεία του κινητού σας για να ξεκινήσετε",
  2: "Επιλέξτε το μοντέλο του κινητού σας",
  3: "Επιλέξτε το πρόβλημα που αντιμετωπίζετε",
  4: "Συμπληρώστε τα στοιχεία σας για να ολοκληρώσετε την κράτηση",
};

export default function RepairPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [otherIssueSelected, setOtherIssueSelected] = useState<boolean>(false);
  const [otherIssueDescription, setOtherIssueDescription] = useState<string>("");

  const calculateTotal = () => {
    return selectedIssues.reduce((total, issue) => {
      const issuePrice = commonIssues.find((i) => i.title === issue)?.price || "0";
      return total + parseInt(issuePrice.replace(/\D/g, ""));
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

  const handleIssueSelect = (issue: string, description?: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );

    if (description) {
      setOtherIssueSelected(true);
      setOtherIssueDescription(issue);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-[80%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16 mx-auto">
            {Object.keys(phoneOptions).map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105  dark:hover:bg-purple-900"
              >
                <Image
                  src={`/brands/${brand.toLowerCase()}.svg`}
                  alt={brand}
                  width={48}
                  height={48}
                  className="mb-3"
                />
                <span className="text-sm font-medium text-center dark:text-white text-gray-600">
                  {brand}
                </span>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="w-[80%] mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-600">
              {stepTitles[2]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {phoneOptions[selectedBrand as keyof typeof phoneOptions].map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className="p-4 dark:text-white text-gray-600 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 text-left dark:hover:bg-purple-900"
                >
                  {model}
                </button>
              ))}
              <button
                onClick={() => handleModelSelect("Άλλο")}
                className="p-4 dark:text-white text-gray-600 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 text-left dark:hover:bg-purple-900"
              >
                Άλλο
              </button>
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-purple-600 hover:text-purple-700"
            >
              ← Πίσω στις μάρκες
            </button>
          </div>
        );

      case 3:
        return (
          <div className="w-[80%] mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-600">
              {stepTitles[3]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {commonIssues.map((issue) => (
                <button
                  key={issue.title}
                  onClick={() => handleIssueSelect(issue.title)}
                  className={`p-6 rounded-xl text-left transition-all hover:shadow-md hover:scale-105 dark:hover:bg-purple-900
                  ${
                    selectedIssues.includes(issue.title)
                      ? "bg-purple-200 dark:bg-purple-900 border-2 border-purple-500 scale-105"
                      : "bg-white dark:bg-gray-800 hover:shadow-md"
                  }`}
                >
                  <span className="text-3xl mb-4 block">{issue.icon}</span>
                  <h3 className="font-medium mb-2 dark:text-white text-gray-600">
                    {issue.title}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-500">{issue.price}</p>
                </button>
              ))}
              <button
                className={`p-6 rounded-xl text-left transition-all ${
                  otherIssueSelected && otherIssueDescription.length > 0
                    ? "bg-purple-100 dark:bg-purple-900 border-2 border-purple-500"
                    : "bg-white dark:bg-gray-800 hover:shadow-md"
                }`}
              >
                <span className="text-3xl mb-4 block">❔</span>
                <h3 className="font-medium mb-2 dark:text-white text-gray-600">
                  Άλλο
                </h3>
                <input
                  placeholder="Περιγραφή του προβλήματος"
                  onChange={(e) => handleIssueSelect(e.target.value, "Άλλο")}
                  type="text"
                  value={otherIssueDescription}
                  className="p-2 rounded-lg dark:bg-gray-600 bg-gray-200 text-gray-600 dark:text-white border-gray-900 w-[200px]"
                />
                <p className="text-purple-600 dark:text-purple-500">Ας το δούμε μαζί!</p>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="text-purple-600 hover:text-purple-700"
              >
                ← Πίσω στα μοντέλα
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={selectedIssues.length === 0}
                className={`px-8 py-3 rounded-lg ${
                  selectedIssues.length > 0
                    ? "bg-purple-600 text-white hover:bg-purple-700"
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
            itemDetails={selectedIssues.map((issue) => ({
              title: `${selectedBrand} ${selectedModel} - ${issue}`,
              price: parseInt(
                commonIssues.find((i) => i.title === issue)?.price.replace(/\D/g, "") || "0"
              ),
            }))}
            onComplete={(data) => {
              console.log("Η κράτηση ολοκληρώθηκε:", {
                device: { brand: selectedBrand, model: selectedModel },
                issues: selectedIssues,
                booking: data,
              });
            }}
            pageId={1}
            repair={true}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 dark:text-white text-gray-600">
            {stepTitles[step]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {stepDescriptions[step]}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {["Εταιρεία", "Μοντέλο", "Βλάβες", "Κράτηση"].map((label, index) => (
              <div
                key={label}
                className={`text-sm ${
                  step > index
                    ? "text-purple-600"
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
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}
      </main>
      {/* Footer - add slight transparency */}
      <footer className="py-5 flex items-center justify-center gap-8 text-sm text-gray-700 dark:text-gray-400 border-t border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Πολιτική Απορρήτου & Όροι Χρήσης</Link>
          <Link href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">Συχνές Ερωτήσεις</Link>
      </footer>
    </div>
  );
}