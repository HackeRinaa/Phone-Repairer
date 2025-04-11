"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "@/components/Calendar.css";
import { PaymentSection } from "@/components/PaymentSection";
import Link from "next/link";

const phoneOptions = {
  Apple: [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone SE (2022)",
    "iPhone SE (2020)",
  ],
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
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
  Αλλο: [
    
  ],
};

// Pricing data structure
type PriceInfo = {
  part: number;
  price: number;
};

type ScreenRepairOptions = {
  [key: string]: PriceInfo;
};

type RepairPricing = {
  screenRepair?: ScreenRepairOptions;
  battery?: PriceInfo;
  chargingPort?: PriceInfo;
  camera?: PriceInfo;
  backCover?: PriceInfo;
};

type BrandPricing = {
  [model: string]: RepairPricing;
};


// Google Pricing Structure
const googlePricing: BrandPricing = {
  "Pixel 8 Pro": {
    screenRepair: {
      original: { part: 228, price: 265.2 }
    },
    battery: { part: 30.48, price: 67.68 },
    chargingPort: { part: 28.76, price: 65.96 },
    backCover: { part: 37.85, price: 75.05 },
    camera: { part: 58, price: 95.2 }
  },
  "Pixel 8": {
    screenRepair: {
      original: { part: 198, price: 235.2 }
    },
    battery: { part: 28.48, price: 65.68 },
    chargingPort: { part: 26.76, price: 63.96 },
    backCover: { part: 35.85, price: 73.05 },
    camera: { part: 53, price: 90.2 }
  }
};

// Huawei Pricing Structure
const huaweiPricing: BrandPricing = {
  "Mate 60 Pro": {
    screenRepair: {
      original: { part: 218, price: 255.2 }
    },
    battery: { part: 29.48, price: 66.68 },
    chargingPort: { part: 27.76, price: 64.96 },
    backCover: { part: 36.85, price: 74.05 },
    camera: { part: 56, price: 93.2 }
  }
};

// Xiaomi Pricing Structure
const xiaomiPricing: BrandPricing = {
  "Mi 13 Pro": {
    screenRepair: {
      original: { part: 208, price: 245.2 }
    },
    battery: { part: 27.48, price: 64.68 },
    chargingPort: { part: 25.76, price: 62.96 },
    backCover: { part: 34.85, price: 72.05 },
    camera: { part: 52, price: 89.2 }
  }
};

// OnePlus Pricing Structure
const oneplusPricing: BrandPricing = {
  "11 5G": {
    screenRepair: {
      original: { part: 198, price: 235.2 }
    },
    battery: { part: 28.48, price: 65.68 },
    chargingPort: { part: 26.76, price: 63.96 },
    backCover: { part: 35.85, price: 73.05 },
    camera: { part: 51, price: 88.2 }
  }
};

// iPhone Pricing Structure
const iphonePricing: BrandPricing = {
  "iPhone 16 Pro Max": {
    screenRepair: {
      hq: { part: 419, price: 419 },
      standard: { part: 419, price: 419 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 199, price: 199 },
    camera: { part: 189, price: 189 },
    backCover: { part: 189, price: 189 }
  },
  "iPhone 16 Pro": {
    screenRepair: {
      hq: { part: 389, price: 389 },
      standard: { part: 389, price: 389 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 189, price: 189 },
    camera: { part: 189, price: 189 },
    backCover: { part: 179, price: 179 }
  },
  "iPhone 16 Plus": {
    screenRepair: {
      hq: { part: 299, price: 299 },
      standard: { part: 299, price: 299 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 179, price: 179 },
    camera: { part: 159, price: 159 },
    backCover: { part: 169, price: 169 }
  },
  "iPhone 16": {
    screenRepair: {
      hq: { part: 269, price: 269 },
      standard: { part: 269, price: 269 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 169, price: 169 },
    camera: { part: 159, price: 159 },
    backCover: { part: 159, price: 159 }
  },
  "iPhone 15 Pro Max": {
    screenRepair: {
      hq: { part: 369, price: 369 },
      standard: { part: 369, price: 369 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 189, price: 189 },
    camera: { part: 179, price: 179 },
    backCover: { part: 179, price: 179 }
  },
  "iPhone 15 Pro": {
    screenRepair: {
      hq: { part: 329, price: 329 },
      standard: { part: 329, price: 329 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 179, price: 179 },
    camera: { part: 169, price: 169 },
    backCover: { part: 169, price: 169 }
  },
  "iPhone 15": {
    screenRepair: {
      hq: { part: 209, price: 209 },
      standard: { part: 209, price: 209 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 169, price: 169 },
    camera: { part: 149, price: 149 },
    backCover: { part: 149, price: 149 }
  },
  "iPhone 15 Plus": {
    screenRepair: {
      hq: { part: 249, price: 249 },
      standard: { part: 249, price: 249 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 169, price: 169 },
    camera: { part: 149, price: 149 },
    backCover: { part: 159, price: 159 }
  },
  "iPhone 14 Pro Max": {
    screenRepair: {
      hq: { part: 289, price: 289 },
      standard: { part: 289, price: 289 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 169, price: 169 },
    camera: { part: 159, price: 159 },
    backCover: { part: 169, price: 169 }
  },
  "iPhone 14 Pro": {
    screenRepair: {
      hq: { part: 269, price: 269 },
      standard: { part: 269, price: 269 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 159, price: 159 },
    camera: { part: 159, price: 159 },
    backCover: { part: 159, price: 159 }
  },
  "iPhone 14": {
    screenRepair: {
      hq: { part: 189, price: 189 },
      standard: { part: 189, price: 189 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 149, price: 149 },
    camera: { part: 139, price: 139 },
    backCover: { part: 139, price: 139 }
  },
  "iPhone 14 Plus": {
    screenRepair: {
      hq: { part: 229, price: 229 },
      standard: { part: 229, price: 229 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 149, price: 149 },
    camera: { part: 139, price: 139 },
    backCover: { part: 149, price: 149 }
  },
  "iPhone 13 Pro Max": {
    screenRepair: {
      hq: { part: 249, price: 249 },
      standard: { part: 249, price: 249 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 149, price: 149 },
    camera: { part: 149, price: 149 },
    backCover: { part: 159, price: 159 }
  },
  "iPhone 13 Pro": {
    screenRepair: {
      hq: { part: 219, price: 219 },
      standard: { part: 219, price: 219 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 139, price: 139 },
    camera: { part: 139, price: 139 },
    backCover: { part: 139, price: 139 }
  },
  "iPhone 13": {
    screenRepair: {
      hq: { part: 169, price: 169 },
      standard: { part: 169, price: 169 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 129, price: 129 },
    camera: { part: 129, price: 129 },
    backCover: { part: 129, price: 129 }
  },
  "iPhone 13 mini": {
    screenRepair: {
      hq: { part: 149, price: 149 },
      standard: { part: 149, price: 149 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 119, price: 119 },
    camera: { part: 119, price: 119 },
    backCover: { part: 119, price: 119 }
  },
  "iPhone 12 Pro Max": {
    screenRepair: {
      hq: { part: 199, price: 199 },
      standard: { part: 199, price: 199 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 139, price: 139 },
    camera: { part: 129, price: 129 },
    backCover: { part: 139, price: 139 }
  },
  "iPhone 12 Pro": {
    screenRepair: {
      hq: { part: 179, price: 179 },
      standard: { part: 179, price: 179 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 119, price: 119 },
    camera: { part: 119, price: 119 },
    backCover: { part: 119, price: 119 }
  },
  "iPhone 12": {
    screenRepair: {
      hq: { part: 139, price: 139 },
      standard: { part: 139, price: 139 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 99, price: 99 },
    camera: { part: 99, price: 99 },
    backCover: { part: 99, price: 99 }
  },
  "iPhone 12 mini": {
    screenRepair: {
      hq: { part: 119, price: 119 },
      standard: { part: 119, price: 119 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 99, price: 99 },
    camera: { part: 99, price: 99 },
    backCover: { part: 99, price: 99 }
  },
  "iPhone 11 Pro Max": {
    screenRepair: {
      hq: { part: 159, price: 159 },
      standard: { part: 159, price: 159 }
    },
    battery: { part: 55, price: 55 },
    chargingPort: { part: 69, price: 69 },
    camera: { part: 109, price: 109 },
    backCover: { part: 139, price: 139 },
  },
  "iPhone 11 Pro": {
    screenRepair: {
      hq: { part: 129, price: 129 },
      standard: { part: 129, price: 129 }
    },
    battery: { part: 55, price: 55 },
    chargingPort: { part: 69, price: 69 },
    camera: { part: 109, price: 109 },
    backCover: { part: 119, price: 119 },
  },
  "iPhone 11": {
    screenRepair: {
      hq: { part: 69, price: 69 },
      standard: { part: 69, price: 69 }
    },
    battery: { part: 49, price: 49 },
    chargingPort: { part: 49, price: 49 },
    camera: { part: 69, price: 69 },
    backCover: { part: 99, price: 99 },
  },
  "iPhone SE (2022)": {
    screenRepair: {
      hq: { part: 59, price: 59 },
      standard: { part: 59, price: 59 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 69, price: 69 },
    camera: { part: 69, price: 69 },
    backCover: { part: 69, price: 69 },
  },
  "iPhone SE (2020)": {
    screenRepair: {
      hq: { part: 59, price: 59 },
      standard: { part: 59, price: 59 }
    },
    battery: { part: 59, price: 59 },
    chargingPort: { part: 69, price: 69 },
    camera: { part: 69, price: 69 },
    backCover: { part: 69, price: 69 },
  }
};

// Samsung Pricing Structure
const samsungPricing: BrandPricing = {
  "Galaxy S24 Ultra": {
    screenRepair: {
      original: { part: 489, price: 489 },
      withFrame: { part: 489, price: 489 }
    },
    battery: { part: 99, price: 99 },
    chargingPort: { part: 89, price: 89 },
    backCover: { part: 89, price: 89 },
    camera: { part: 45, price: 53.1 }
  },
  "Galaxy S24+": {
    screenRepair: {
      original: { part: 339, price: 339 },
      withFrame: { part: 339, price: 339 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 85, price: 85 },
    backCover: { part: 79, price: 79 },
    camera: { part: 45, price: 53.1 }
  },
  "Galaxy S24": {
    screenRepair: {
      original: { part: 289, price: 289 },
      withFrame: { part: 289, price: 289 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 45, price: 53.1 }
  },
  "Galaxy S23 Ultra": {
    screenRepair: {
      original: { part: 439, price: 439 },
      withFrame: { part: 439, price: 439 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S23+": {
    screenRepair: {
      original: { part: 239, price: 239 },
      withFrame: { part: 239, price: 239 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 75, price: 75 },
    backCover: { part: 69, price: 69 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S23": {
    screenRepair: {
      original: { part: 229, price: 229 },
      withFrame: { part: 229, price: 229 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 69, price: 69 },
    backCover: { part: 69, price: 69 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S22 Ultra": {
    screenRepair: {
      original: { part: 310, price: 310 },
      withFrame: { part: 310, price: 310 }
    },
    battery: { part: 79, price: 79 },
    chargingPort: { part: 69, price: 69 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S22+": {
    screenRepair: {
      original: { part: 215, price: 215 },
      withFrame: { part: 215, price: 215 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 69, price: 69 },
    backCover: { part: 69, price: 69 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S22": {
    screenRepair: {
      original: { part: 209, price: 209 },
      withFrame: { part: 209, price: 209 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 65, price: 65 },
    backCover: { part: 69, price: 69 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S21 Ultra": {
    screenRepair: {
      original: { part: 349, price: 349 },
      withFrame: { part: 349, price: 349 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 65, price: 65 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S21+": {
    screenRepair: {
      original: { part: 229, price: 229 },
      withFrame: { part: 229, price: 229 }
    },
    battery: { part: 69, price: 69 },
    chargingPort: { part: 60, price: 60 },
    backCover: { part: 59, price: 59 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy S21": {
    screenRepair: {
      original: { part: 219, price: 219 },
      withFrame: { part: 219, price: 219 }
    },
    battery: { part: 65, price: 65 },
    chargingPort: { part: 60, price: 60 },
    backCover: { part: 69, price: 69 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy Z Fold 5": {
    screenRepair: {
      original: { part: 669, price: 669 }, // inner screen
      withFrame: { part: 180, price: 180 } // outer screen
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy Z Flip 5": {
    screenRepair: {
      original: { part: 480, price: 480 },
      withFrame: { part: 480, price: 480 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy Z Fold 4": {
    screenRepair: {
      original: { part: 699, price: 699 }, // inner screen
      withFrame: { part: 210, price: 210 } // outer screen
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy Z Flip 4": {
    screenRepair: {
      original: { part: 480, price: 480 },
      withFrame: { part: 480, price: 480 }
    },
    battery: { part: 89, price: 89 },
    chargingPort: { part: 79, price: 79 },
    backCover: { part: 79, price: 79 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy A54": {
    screenRepair: {
      original: { part: 150, price: 150 }, // Average from "120 έως 200"
      withFrame: { part: 150, price: 150 }
    },
    battery: { part: 70, price: 70 }, // Average from "60 έως 80"
    chargingPort: { part: 70, price: 70 }, // Average from "60 έως 80"
    backCover: { part: 70, price: 70 }, // Average from "60 έως 80"
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy A34": {
    screenRepair: {
      original: { part: 150, price: 150 },
      withFrame: { part: 150, price: 150 }
    },
    battery: { part: 70, price: 70 },
    chargingPort: { part: 70, price: 70 },
    backCover: { part: 70, price: 70 },
    camera: { part: 40, price: 47.2 }
  },
  "Galaxy A14": {
    screenRepair: {
      original: { part: 150, price: 150 },
      withFrame: { part: 150, price: 150 }
    },
    battery: { part: 70, price: 70 },
    chargingPort: { part: 70, price: 70 },
    backCover: { part: 70, price: 70 },
    camera: { part: 40, price: 47.2 }
  }
};

// Combined pricing data
const pricingData = {
  Apple: iphonePricing,
  Samsung: samsungPricing,
  Google: googlePricing,
  Huawei: huaweiPricing,
  Xiaomi: xiaomiPricing,
  OnePlus: oneplusPricing
};

// Issue-to-property mapping
const issueToProperty = {
  "Επισκευή Οθόνης": "screenRepair",
  "Αντικατάσταση Μπαταρίας": "battery",
  "Επισκευή Κάμερας": "camera", 
  "Επισκευή Θύρας Φόρτισης": "chargingPort",
  "Πίσω καπάκι / πλαίσιο": "backCover"
};

// Issue mapping
const commonIssues = [
  { title: "Επισκευή Οθόνης", icon: "🔧", price: "από 89€" },
  { title: "Αντικατάσταση Μπαταρίας", icon: "🔋", price: "από 49€" },
  { title: "Επισκευή Κάμερας", icon: "📸", price: "από 47€" },
  { title: "Επισκευή Θύρας Φόρτισης", icon: "🔌", price: "από 69€" },
  { title: "Πίσω καπάκι / πλαίσιο", icon: "🔧", price: "από 69€" },
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

// Near the top of the file, before the component definition, add this type
interface BookingData {
  date: Date | null;
  timeSlot: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  paymentMethod: 'online' | 'instore';
}

export default function RepairPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [otherIssueSelected, setOtherIssueSelected] = useState<boolean>(false);
  const [otherIssueDescription, setOtherIssueDescription] = useState<string>("");

  // Add event listener for navigateBack event
  useEffect(() => {
    // Check URL params for step
    const checkUrlStep = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        const stepNumber = parseInt(stepParam);
        if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 4) {
          setStep(stepNumber);
        }
      }
    };
    
    // Check URL params initially
    checkUrlStep();

    // Also check when URL changes (for history navigation)
    window.addEventListener('popstate', checkUrlStep);

    // Handle navigateBack event
    const handleNavigateBack = (e: CustomEvent) => {
      const { pageId, targetStep } = e.detail;
      if (pageId === 1 && targetStep === 3) {
        setStep(3);
      }
    };

    window.addEventListener('navigateBack', handleNavigateBack as EventListener);
    
    return () => {
      window.removeEventListener('navigateBack', handleNavigateBack as EventListener);
      window.removeEventListener('popstate', checkUrlStep);
    };
  }, []);

  // Get price for a specific issue based on the selected device
  const getPriceForIssue = (issue: string): number => {
    if (selectedBrand === "Αλλο") {
      return 0; // "Ας το δούμε μαζί" case
    }

    const brand = selectedBrand as keyof typeof pricingData;
    const brandPricing = pricingData[brand];
    if (!brandPricing) return getDefaultPriceForIssue(issue);

    const modelPricing = brandPricing[selectedModel];
    if (!modelPricing) return getDefaultPriceForIssue(issue);

    const propertyName = issueToProperty[issue as keyof typeof issueToProperty];
    if (!propertyName || !modelPricing[propertyName as keyof RepairPricing]) {
      return getDefaultPriceForIssue(issue);
    }

    const repairInfo = modelPricing[propertyName as keyof RepairPricing];
    
    // Handle screen repair which has multiple options
    if (propertyName === "screenRepair" && typeof repairInfo === "object" && !("price" in repairInfo)) {
      // Choose the first option available for screen repair
      const firstOption = Object.values(repairInfo as ScreenRepairOptions)[0];
      return firstOption.price;
    }
    
    return (repairInfo as PriceInfo).price;
  };

  // Default price fallback for issues
  const getDefaultPriceForIssue = (issue: string): number => {
    const defaultPrices: Record<string, number> = {
      "Επισκευή Οθόνης": 150,
      "Αντικατάσταση Μπαταρίας": 80,
      "Επισκευή Κάμερας": 90,
      "Επισκευή Θύρας Φόρτισης": 85,
      "Πίσω καπάκι / πλαίσιο": 90
    };
    return defaultPrices[issue] || 100; // Return 100 as default if the issue is not found
  };

  // Get price display for an issue
  const getPriceDisplay = (issue: string): string => {
    if (selectedBrand === "Αλλο") {
      return "Ας το δούμε μαζί";
    }
    
    const price = getPriceForIssue(issue);
    return price > 0 ? `${price}€` : "Ας το δούμε μαζί";
  };

  const calculateTotal = () => {
    return selectedIssues.reduce((total, issue) => {
      if (selectedBrand === "Αλλο") return total;
      return total + getPriceForIssue(issue);
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

  // Update the function to use the BookingData type instead of any
  const handleRepairComplete = async (data: BookingData) => {
    console.log("Η κράτηση ολοκληρώθηκε:", {
      device: { brand: selectedBrand, model: selectedModel },
      issues: selectedIssues,
      booking: data,
    });

    // Send notification to admin about the new repair request
    try {
      const response = await fetch('/api/notifications/repair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: selectedBrand,
          model: selectedModel,
          issues: selectedIssues,
          customerName: data.contactInfo.name,
          customerEmail: data.contactInfo.email,
          customerPhone: data.contactInfo.phone,
          date: data.date,
          timeSlot: data.timeSlot,
          totalAmount: calculateTotal(),
          notes: data.contactInfo.notes,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send admin notification');
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
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
              ← Πίσω στις εταιρίες
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
                  <p className="text-purple-600 dark:text-purple-500">{getPriceDisplay(issue.title)}</p>
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
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-6">
              <p>* Οι παραπάνω τιμές είναι ενδεικτικές. Η τελική τιμή θα διαμορφωθεί βάσει της διαθεσιμότητας του ανταλλακτικού.</p>
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
              price: selectedBrand === "Αλλο" ? 0 : getPriceForIssue(issue),
            }))}
            onComplete={(data) => {
              handleRepairComplete(data);
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
    <div className="overflow-hidden w-full flex flex-col justify-center items-center  min-h-[100dvh] bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
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