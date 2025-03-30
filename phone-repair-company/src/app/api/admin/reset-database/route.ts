import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Extract admin key from query params
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    
    // Verify admin key
    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid admin key.' },
        { status: 401 }
      );
    }
    
    // Clear bookings
    const deletedBookings = await prisma.booking.deleteMany({});
    
    // Clear phone listings
    const deletedPhoneListings = await prisma.phoneListing.deleteMany({});
    
    // Clear phones for sale
    const deletedPhonesForSale = await prisma.phoneForSale.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successful',
      deletedBookings: deletedBookings.count,
      deletedPhoneListings: deletedPhoneListings.count,
      deletedPhonesForSale: deletedPhonesForSale.count
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 