"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ username: string; password: string } | null>(null);

  const resetAdmin = async () => {
    if (!confirm("This will delete all admin users and create a new one. Continue?")) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Admin user reset successfully!");
        setResult(data.credentials);
      } else {
        toast.error(data.error || "Failed to reset admin user");
      }
    } catch (error) {
      console.error("Error resetting admin:", error);
      toast.error("An error occurred while resetting admin user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Reset</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Reset admin credentials for the application
          </p>
        </div>

        {result ? (
          <div className="mt-8">
            <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-200">Admin Reset Successful</h3>
              <div className="mt-4 text-sm text-green-800 dark:text-green-300">
                <p><strong>Username:</strong> {result.username}</p>
                <p><strong>Password:</strong> {result.password}</p>
                <p className="mt-2 text-xs italic">Save these credentials in a secure place!</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Link 
                href="/admin/login" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </Link>
              
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset Again
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <button
              onClick={resetAdmin}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Admin User"}
            </button>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              This will delete all existing admin users and create a new default admin account.
            </p>
            
            <div className="mt-6 text-center">
              <Link 
                href="/admin/login" 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 