import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const listings = await prisma.phoneListing.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Error fetching phone listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone listings' },
      { status: 500 }
    );
  }
} 