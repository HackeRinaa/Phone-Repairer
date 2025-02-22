import Link from "next/link";
import { TechBackground } from "./techBackground";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Add TechBackground with a lower z-index */}
      <div className="absolute inset-0 z-0">
        <TechBackground />
      </div>
      
      {/* Wrap existing content in a relative container with higher z-index */}
      <div className="relative z-10 grid grid-rows-[80px_1fr_60px] min-h-screen">
        <Navbar />

        {/* Main Content - add container with slight transparency */}
        <main className="flex flex-col items-center justify-center gap-12 px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Επισκευή & Πώληση Κινητών
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
              Γρήγορες και αξιόπιστες επισκευές κινητών ή οικονομικά ανακατασκευασμένα κινητά.
              Επιλέξτε την υπηρεσία που χρειάζεστε.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/repair"
              className="px-8 py-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 transition-colors text-center min-w-[200px]"
            >
              Επισκευή Κινητού
            </Link>
            <Link
              href="/purchase"
              className="px-8 py-4 border-2 border-blue-600 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-center min-w-[200px]"
            >
              Αγορά Ανακατασκευασμένου
            </Link>
          </div>
        </main>

        {/* Footer - add slight transparency */}
        <footer className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link href="/privacy" className="hover:text-blue-600">Πολιτική Απορρήτου</Link>
          <Link href="/terms" className="hover:text-blue-600">Όροι Χρήσης</Link>
          <Link href="/contact" className="hover:text-blue-600">Επικοινωνία</Link>
        </footer>
      </div>
    </div>
  );
}
