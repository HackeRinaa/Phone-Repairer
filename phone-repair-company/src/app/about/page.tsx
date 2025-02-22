import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const services = [
    {
      title: "Επαγγελματική Επισκευή",
      description: "Υπηρεσίες επισκευής από πιστοποιημένους τεχνικούς με γνήσια ανταλλακτικά",
      icon: "🛠️"
    },
    {
      title: "Γρήγορη Εξυπηρέτηση",
      description: "Οι περισσότερες επισκευές ολοκληρώνονται εντός 24 ωρών",
      icon: "⚡"
    },
    {
      title: "Εγγύηση",
      description: "90 ημέρες εγγύηση σε όλες τις επισκευές και τις ανακατασκευασμένες συσκευές",
      icon: "🛡️"
    },
    {
      title: "Καλύτερες Τιμές",
      description: "Ανταγωνιστικές τιμές χωρίς κρυφές χρεώσεις",
      icon: "💰"
    }
  ];

  const stats = [
    { number: "10χιλ+", label: "Επισκευές" },
    { number: "99%", label: "Ικανοποίηση Πελατών" },
    { number: "5+", label: "Χρόνια Εμπειρίας" },
    { number: "3", label: "Καταστήματα" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Ο Αξιόπιστος Συνεργάτης σας στην Επισκευή Κινητών
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Με πάνω από 5 χρόνια εμπειρίας, έχουμε βοηθήσει χιλιάδες πελάτες
            να επαναφέρουν τις συσκευές τους σε άριστη κατάσταση λειτουργίας.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Οι Υπηρεσίες μας</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Πώς Λειτουργούμε</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Κλείστε Ραντεβού</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Επιλέξτε τη συσκευή σας και πείτε μας τι χρειάζεται επισκευή
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Διάγνωση</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Οι τεχνικοί μας θα εξετάσουν τη συσκευή σας και θα σας δώσουν προσφορά
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3">Γρήγορη Επισκευή</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Παραλάβετε τη συσκευή σας σε άριστη κατάσταση λειτουργίας
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Έτοιμοι να Ξεκινήσουμε;</h2>
          <p className="mb-8 text-lg">
            Κλείστε το ραντεβού σας σήμερα και επισκευάστε τη συσκευή σας άμεσα
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Κλείστε Ραντεβού
          </button>
        </div>
      </main>
    </div>
  );
} 