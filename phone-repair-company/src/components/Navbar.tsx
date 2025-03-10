{/*import Image from "next/image";*/}
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full shadow-sm px-8 h-20 flex items-center justify-between">
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
        <Link href="/about" className="hover:text-purple-600">Υπηρεσίες</Link>
        <Link href="/repair" className="hover:text-purple-600">Επισκευή</Link>
        <Link href="/purchase" className="hover:text-purple-600">Αγορά Μεταχειρισμένου</Link>
        <Link href="/contact" className="hover:text-purple-600">Επικοινωνία</Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
} 