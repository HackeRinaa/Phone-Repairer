"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

// Extended user type to include role and id
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
  role: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [phoneListings, setPhoneListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          // Fetch user's phone listings
          const listingsResponse = await fetch("/api/phone-listings?userId=" + (session.user as ExtendedUser).id);
          if (listingsResponse.ok) {
            const listingsData = await listingsResponse.json();
            setPhoneListings(listingsData);
          }
          
          // Fetch user's bookings
          const bookingsResponse = await fetch("/api/bookings");
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setBookings(bookingsData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load your data");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [session, status]);
  
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </main>
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }
  
  const user = session?.user as ExtendedUser;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Ο Λογαριασμός μου
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 text-2xl font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user?.name || "Χρήστης"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Ρόλος: {user?.role === "admin" ? "Διαχειριστής" : user?.role === "technician" ? "Τεχνικός" : "Χρήστης"}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/account/listings"
                className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Οι Αγγελίες μου</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Διαχειριστείτε τις αγγελίες των κινητών σας</p>
              </Link>
              
              <Link
                href="/account/bookings"
                className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Τα Ραντεβού μου</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Δείτε και διαχειριστείτε τα ραντεβού επισκευής</p>
              </Link>
              
              <Link
                href="/account/orders"
                className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-1">Οι Παραγγελίες μου</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ιστορικό αγορών και παραγγελιών</p>
              </Link>
              
              <Link
                href="/account/settings"
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Ρυθμίσεις</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Διαχειριστείτε τις ρυθμίσεις του λογαριασμού σας</p>
              </Link>
            </div>
            
            {user?.role === "admin" && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Διαχείριση</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Έχετε πρόσβαση στο διαχειριστικό panel</p>
                <Link
                  href="/admin/dashboard"
                  className="inline-block px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Πίνακας Διαχείρισης
                </Link>
              </div>
            )}
          </div>
          
          {/* Recent activity section could be added here */}
        </div>
      </main>
    </div>
  );
} 