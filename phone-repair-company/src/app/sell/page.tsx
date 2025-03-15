"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar"; // Assuming you have a Navbar component


const SellPhonePage: React.FC = () => {
  
  
  // State for form input
  const [phoneDetails, setPhoneDetails] = useState({
    brand: "",
    model: "",
    price: 0,
    condition: "",
    storage: "",
    image: "",
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPhoneDetails({ ...phoneDetails, [name]: value });
  };

  // Handle file input change for image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Assuming you want to upload the image to your server or cloud
      // For now, we just set the file name as a placeholder
      setPhoneDetails({ ...phoneDetails, image: file.name });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can send the data to your backend or handle it however you'd like
    console.log("Phone details submitted:", phoneDetails);
    
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Πωλήστε το κινητό σας
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Μάρκα</label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={phoneDetails.brand}
              onChange={handleChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              placeholder="Εισάγετε την μάρκα του κινητού"
              required
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Μοντέλο</label>
            <input
              id="model"
              name="model"
              type="text"
              value={phoneDetails.model}
              onChange={handleChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              placeholder="Εισάγετε το μοντέλο"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Τιμή</label>
            <input
              id="price"
              name="price"
              type="number"
              value={phoneDetails.price}
              onChange={handleChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              placeholder="Εισάγετε την τιμή"
              required
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Κατάσταση</label>
            <select
              id="condition"
              name="condition"
              value={phoneDetails.condition}
              onChange={handleChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              required
            >
              <option value="">Επιλέξτε την κατάσταση</option>
              <option value="Excellent">Άριστη</option>
              <option value="Very Good">Πολύ Καλή</option>
              <option value="Good">Καλή</option>
            </select>
          </div>

          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Αποθηκευτικός Χώρος</label>
            <select
              id="storage"
              name="storage"
              value={phoneDetails.storage}
              onChange={handleChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              required
            >
              <option value="">Επιλέξτε αποθηκευτικό χώρο</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Φωτογραφία</label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 mt-2 rounded border border-gray-600 dark:border-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Υποβολή Αγγελίας
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SellPhonePage;
