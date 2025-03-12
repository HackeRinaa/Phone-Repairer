{/*import Image from "next/image";*/}
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
export default function Navbar() {
  return (
    <nav className="z-100 sticky top-0 w-full shadow-sm px-8 h-20 flex items-center justify-between border-b border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2">
        {/*<Image
          src="/logo.svg"
          alt="Fix & Go Logo"
          width={40}
          height={40}
          priority
        />*/}
        <span className="text-4xl font-bold text-purple-600">iRescue</span>
      </Link>
      <div className="hidden sm:flex gap-8 text-lg">
        <Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">Υπηρεσίες</Link>
        <Link href="/repair" className="hover:text-purple-600 dark:hover:text-purple-400">Επισκευή</Link>
        <Link href="/purchase" className="hover:text-purple-600 dark:hover:text-purple-400">Αγορά Μεταχειρισμένου</Link>
        <Link href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Επικοινωνία</Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
} 