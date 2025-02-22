import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const contacts = await prisma.contact.findMany({
    where: { status: 'unread' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Πίνακας Διαχείρισης</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Πρόσφατες Κρατήσεις</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border-b pb-4">
                <p className="font-medium">{booking.brand} {booking.model}</p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString('el')} - {booking.timeSlot}
                </p>
                <p className="text-sm text-gray-600">{booking.name}</p>
                <span className={`text-sm ${
                  booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {booking.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Νέα Μηνύματα</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border-b pb-4">
                <p className="font-medium">{contact.subject}</p>
                <p className="text-sm text-gray-600">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 