"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Πώς μπορώ να κλείσω ραντεβού για επισκευή;",
      answer:
        "Μπορείτε να κλείσετε ραντεβού επιλέγοντας τη μάρκα και το μοντέλο του κινητού σας, καθώς και το πρόβλημα που αντιμετωπίζετε. Στη συνέχεια, συμπληρώστε τα στοιχεία σας και επιλέξτε την ημερομηνία και ώρα που σας βολεύει.",
    },
    {
      question: "Πόσο κοστίζει η επισκευή;",
      answer:
        "Το κόστος της επισκευής εξαρτάται από το πρόβλημα που αντιμετωπίζει η συσκευή σας. Μπορείτε να δείτε τις βασικές τιμές μας στη λίστα με τα κοινά προβλήματα. Για ακριβέστερη εκτίμηση, επικοινωνήστε μαζί μας.",
    },
    {
      question: "Πόσο χρόνο διαρκεί η επισκευή;",
      answer:
        "Ο χρόνος επισκευής εξαρτάται από το πρόβλημα και τη διαθεσιμότητα ανταλλακτικών. Σε περιπτώσεις απλών επισκευών, η διαδικασία μπορεί να ολοκληρωθεί την ίδια ημέρα. Για πιο σύνθετες επισκευές, μπορεί να χρειαστούν έως και 2-3 εργάσιμες ημέρες.",
    },
    {
      question: "Ποια είναι η πολιτική εγγύησης;",
      answer:
        "Όλες οι επισκευές μας καλύπτονται από εγγύηση 6 μηνών. Η εγγύηση ισχύει για το συγκεκριμένο πρόβλημα που επισκευάστηκε και δεν καλύπτει νέα προβλήματα που προκύπτουν από κακή χρήση ή φυσική φθορά.",
    },
    {
      question: "Μπορώ να ακυρώσω ή να αλλάξω το ραντεβού μου;",
      answer:
        "Ναι, μπορείτε να ακυρώσετε ή να αλλάξετε το ραντεβού σας έως και 24 ώρες πριν την ημερομηνία του ραντεβού. Επικοινωνήστε μαζί μας τηλεφωνικά ή μέσω email για να κάνετε τις αλλαγές.",
    },
    {
      question: "Πληρώνω κάτι αν δεν πάρω το κινητό μου μετά την επισκευή;",
      answer:
        "Εάν δεν παραλάβετε τη συσκευή σας εντός 30 ημερών από την ολοκλήρωση της επισκευής, θα χρεωθείτε ένα ποσό για αποθήκευση. Σε περίπτωση που η συσκευή παραμείνει απαράληπτη για 90 ημέρες, θα θεωρηθεί εγκαταλελειμμένη.",
    },
    {
      question: "Ποιοι τρόποι πληρωμής δέχεστε;",
      answer:
        "Δέχονται πληρωμές με μετρητά, πιστωτικές/χρεωστικές κάρτες και μέσω ηλεκτρονικών πληρωμών (PayPal, κλπ.).",
    },
    {
      question: "Επισκευάζετε συσκευές εκτός εγγύησης;",
      answer:
        "Ναι, επισκευάζουμε συσκευές εκτός εγγύησης. Το κόστος της επισκευής θα εξαρτηθεί από το πρόβλημα και τη διαθεσιμότητα ανταλλακτικών.",
    },
    {
      question: "Πώς μπορώ να επικοινωνήσω μαζί σας;",
      answer:
        "Μπορείτε να επικοινωνήσετε μαζί μας τηλεφωνικά στο 210 123 4567, μέσω email στο info@repaircenter.gr, ή να μας επισκεφτείτε στο κατάστημά μας στη διεύθυνση Πατησίων 123, Αθήνα.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
        <Navbar/>
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center dark:text-white text-gray-600">
          Συχνές Ερωτήσεις (FAQ)
        </h1>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold dark:text-white text-gray-600">
                  {faq.question}
                </h2>
                <span className="text-purple-600 dark:text-purple-500 text-2xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </main>
      {/* Footer - add slight transparency */}
      <footer className="py-5 flex items-center justify-center gap-8 text-sm text-gray-700 dark:text-gray-400 border-t border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Πολιτική Απορρήτου & Όροι Χρήσης</Link>
          <Link href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">Συχνές Ερωτήσεις</Link>
      </footer>
    </div>
  );
}