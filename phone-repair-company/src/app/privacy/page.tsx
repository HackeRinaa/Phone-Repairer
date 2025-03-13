"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar/>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center dark:text-white text-gray-600">
          Πολιτική Απορρητου και Όροι Χρήσης
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Πολιτική Απορρητου */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white text-gray-600">
              Πολιτική Απορρητου
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Η πολιτική απορρητου μας περιγράφει πώς συλλέγουμε, χρησιμοποιούμε και
                προστατεύουμε τα προσωπικά σας δεδομένα όταν χρησιμοποιείτε την
                πλατφόρμα μας.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  1. Συλλογή Δεδομένων
                </h3>
                <p>
                  Συλλέγουμε τα ακόλουθα δεδομένα όταν κάνετε μια κράτηση ή
                  επικοινωνείτε μαζί μας:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>Ονοματεπώνυμο</li>
                  <li>Διεύθυνση ηλεκτρονικού ταχυδρομείου</li>
                  <li>Αριθμός τηλεφώνου</li>
                  <li>Διεύθυνση</li>
                  <li>Στοιχεία συσκευής (μάρκα, μοντέλο, πρόβλημα)</li>
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  2. Χρήση Δεδομένων
                </h3>
                <p>
                  Τα δεδομένα σας χρησιμοποιούνται για τους ακόλουθους σκοπούς:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>Επεξεργασία κρατήσεων και επισκευών</li>
                  <li>Επικοινωνία μαζί σας σχετικά με την κράτηση σας</li>
                  <li>Βελτίωση των υπηρεσιών μας</li>
                  <li>Αποστολή ενημερωτικών μηνυμάτων (μόνο με τη συγκατάθεσή σας)</li>
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  3. Προστασία Δεδομένων
                </h3>
                <p>
                  Τα δεδομένα σας προστατεύονται με κρυπτογράφηση και αποθηκεύονται σε
                  ασφαλείς διακομιστές. Δεν μοιραζόμαστε τα δεδομένα σας με τρίτους χωρίς
                  τη συγκατάθεσή σας, εκτός αν απαιτείται από το νόμο.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  4. Δικαιώματα Χρήστη
                </h3>
                <p>
                  Έχετε το δικαίωμα να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των
                  δεδομένων σας. Επίσης, μπορείτε να αντιταχθείτε στην επεξεργασία των
                  δεδομένων σας ή να ζητήσετε περιορισμό της χρήσης τους.
                </p>
              </div>
            </div>
          </section>

          {/* Όροι Χρήσης */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white text-gray-600">
              Όροι Χρήσης
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Οι όροι χρήσης μας καθορίζουν τους κανόνες και τις προϋποθέσεις για τη
                χρήση της πλατφόρμας μας.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  1. Αποδοχή Όρων
                </h3>
                <p>
                  Με την χρήση της πλατφόρμας μας, συμφωνείτε με τους παρόντες όρους
                  χρήσης. Εάν δεν συμφωνείτε, παρακαλούμε να μην χρησιμοποιείτε την
                  πλατφόρμα.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  2. Κρατήσεις και Πληρωμές
                </h3>
                <p>
                  Οι κρατήσεις γίνονται δεσμευτικές μόνο μετά την επιβεβαίωση της
                  πληρωμής. Δεχόμαστε πληρωμές με μετρητά, κάρτες και ηλεκτρονικές
                  πληρωμές.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  3. Ακύρωση Κράτησης
                </h3>
                <p>
                  Μπορείτε να ακυρώσετε μια κράτηση έως και 24 ώρες πριν την ημερομηνία
                  του ραντεβού. Μετά από αυτή την περίοδο, ενδέχεται να χρεωθείτε ένα
                  ποσό.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  4. Ευθύνη
                </h3>
                <p>
                  Δεν φέρουμε ευθύνη για ζημιές που προκύπτουν από κακή χρήση της
                  συσκευής μετά την επισκευή. Επίσης, δεν ευθυνόμαστε για ζημιές που
                  προκύπτουν από ανταλλακτικά μη εγκεκριμένα από τον κατασκευαστή.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-medium dark:text-white text-purple-600">
                  5. Αλλαγές στους Όρους
                </h3>
                <p>
                  Διατηρούμε το δικαίωμα να τροποποιούμε τους όρους χρήσης ανά πάσα
                  στιγμή. Οι αλλαγές θα ισχύουν από τη στιγμή της δημοσίευσής τους στην
                  πλατφόρμα.
                </p>
              </div>
            </div>
          </section>
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