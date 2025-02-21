import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full bg-white dark:bg-gray-900 shadow-sm px-8 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Fix & Go Logo"
          width={40}
          height={40}
          priority
        />
        <span className="text-xl font-bold">Fix & Go</span>
      </Link>
      <div className="hidden sm:flex gap-8">
        <Link href="/about" className="hover:text-blue-600">Service</Link>
        <Link href="/repair" className="hover:text-blue-600">Repair</Link>
        <Link href="/purchase" className="hover:text-blue-600">Purchase</Link>
        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
      </div>
    </nav>
  );
} 