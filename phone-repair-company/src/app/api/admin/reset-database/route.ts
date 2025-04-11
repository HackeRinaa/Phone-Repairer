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

    // Clear repairBookings first (if this table exists and has foreign keys)
    try {
      await prisma.$executeRaw`TRUNCATE "Booking" CASCADE;`;
    } catch (error) {
      console.error('Error truncating Booking table:', error);
      // Try the deleteMany approach as fallback
      const deletedBookings = await prisma.booking.deleteMany({});
      console.log(`Deleted ${deletedBookings.count} bookings via deleteMany`);
    }
    
    // Clear phoneListings
    const deletedPhoneListings = await prisma.phoneListing.deleteMany({});
    
    // Clear phones for sale
    const deletedPhonesForSale = await prisma.phoneForSale.deleteMany({});

    // Get current count of bookings after deletion to verify
    const remainingBookings = await prisma.booking.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successful',
      deletedBookings: 'All', // We can't know the exact count with TRUNCATE
      remainingBookings,
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