import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const services = [
    {
      title: "Expert Repairs",
      description: "Professional repair service with certified technicians and genuine parts",
      icon: "🛠️"
    },
    {
      title: "Quick Turnaround",
      description: "Most repairs completed within 24 hours",
      icon: "⚡"
    },
    {
      title: "Warranty Coverage",
      description: "90-day warranty on all repairs and refurbished devices",
      icon: "🛡️"
    },
    {
      title: "Best Price",
      description: "Competitive pricing with no hidden fees",
      icon: "💰"
    }
  ];

  const stats = [
    { number: "10k+", label: "Repairs Completed" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "5+", label: "Years Experience" },
    { number: "3", label: "Service Centers" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Your Trusted Phone Repair Partner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            With over 5 years of experience, we&apos;ve helped thousands of customers
            get their devices back to perfect working condition.
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
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Book a Repair</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your device and tell us what needs fixing
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Diagnostic</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our experts will examine your device and provide a quote
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3">Quick Fix</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get your device back in perfect working condition
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg">
            Book your repair appointment today and get your device fixed in no time
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Book a Repair
          </button>
        </div>
      </main>
    </div>
  );
} 