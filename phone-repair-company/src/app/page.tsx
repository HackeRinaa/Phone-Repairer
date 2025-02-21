import Image from "next/image";
import Link from "next/link";
import { TechBackground } from "./techBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Add TechBackground with a lower z-index */}
      <div className="absolute inset-0 z-0">
        <TechBackground />
      </div>
      
      {/* Wrap existing content in a relative container with higher z-index */}
      <div className="relative z-10 grid grid-rows-[80px_1fr_60px] min-h-screen">
        {/* Navbar - add slight transparency */}
        <nav className="sticky top-0 w-full  backdrop-blur-sm shadow-sm px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Fix & Go Logo"
              width={40}
              height={40}
              priority
            />
            <span className="text-xl font-bold">Fix & Go</span>
          </div>
          <div className="hidden sm:flex gap-8">
            <Link href="/about" className="hover:text-blue-600">Service</Link>
            <Link href="/repair" className="hover:text-blue-600">Repair</Link>
            <Link href="/purchase" className="hover:text-blue-600">Purchase</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </nav>

        {/* Main Content - add container with slight transparency */}
        <main className="flex flex-col items-center justify-center gap-12 px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Phone Repair & Resell Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
              Quick and reliable phone repair services or affordable refurbished phones.
              Choose your service below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/repair"
              className="px-8 py-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 transition-colors text-center min-w-[200px]"
            >
              Repair My Phone
            </Link>
            <Link
              href="/purchase"
              className="px-8 py-4 border-2 border-blue-600 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-center min-w-[200px]"
            >
              Buy a Refurbished Phone
            </Link>
          </div>
        </main>

        {/* Footer - add slight transparency */}
        <footer className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
        </footer>
      </div>
    </div>
  );
}
