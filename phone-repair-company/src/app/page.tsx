import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SwipeCarousel } from "@/components/Hero/page";



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 relative">
      
      {/* Wrap existing content in a relative container with higher z-index */}
      <div className="relative z-10 grid grid-rows-[80px_1fr_60px] min-h-screen">
        <Navbar />
 
        <main className="flex-1 overflow-hidden">
          <SwipeCarousel />
        </main>

        {/* Footer - add slight transparency */}
        <footer className="flex items-center justify-center gap-8 text-sm text-gray-700 dark:text-gray-400 border-t border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Πολιτική Απορρήτου</Link>
          <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">Όροι Χρήσης</Link>
          <Link href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Επικοινωνία</Link>
        </footer>
      </div>
    </div>
  );
}
