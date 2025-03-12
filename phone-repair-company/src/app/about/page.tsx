"use client";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const services = [
    {
      title: "Δωρεάν Εκτίμηση & Μεταφορικά",
      description: "Στέλνεις τη συσκευή σου δωρεάν, την ελέγχουμε και σου δίνουμε προσφορά χωρίς καμία δέσμευση!",
      icon: "🚚"
    },
    {
      title: "Άμεση Επισκευή",
      description: "Επισκευάζουμε γρήγορα και αξιόπιστα, με τις περισσότερες εργασίες να ολοκληρώνονται σε 24 ώρες!",
      icon: "⚡"
    },
    {
      title: "Εγγύηση Αξιοπιστίας",
      description: "Όλες οι επισκευές μας καλύπτονται από 90 ημέρες εγγύηση!",
      icon: "🛡️"
    },
    {
      title: "Οι Καλύτερες Τιμές",
      description: "Εξαιρετικές τιμές χωρίς κρυφές χρεώσεις και με διαφάνεια!",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Φτιάξε, Πούλησε ή Αγόρασε Μεταχειρισμένα Κινητά <span className="text-purple-600"> Άμεσα!</span>  
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Δεν έχουμε φυσικό κατάστημα, αλλά σου προσφέρουμε την πιο γρήγορη και αξιόπιστη εξυπηρέτηση! Θες να φτιάξεις, να πουλήσεις ή να αγοράσεις μεταχειρισμένο κινητό; Έλα σε εμάς!
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Γιατί να μας Επιλέξεις;</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-700 dark:text-gray-400"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Έτοιμος να Ξεκινήσεις;</h2>
          <p className="mb-8 text-lg text-gray-100">
            Στείλε μας το κινητό σου ή δες τις διαθέσιμες μεταχειρισμένες συσκευές μας!
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Ζήτησε Δωρεάν Εκτίμηση
          </button>
        </div>
      </main>
    </div>
  );
}
