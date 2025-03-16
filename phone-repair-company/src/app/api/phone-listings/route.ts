import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received phone listing data:', data);

    // Validate required fields
    if (!data.brand || !data.model || !data.price || !data.condition || !data.storage) {
      return NextResponse.json(
        { error: 'Missing required phone information' },
        { status: 400 }
      );
    }

    // Create the phone listing in the database
    const listing = await prisma.phoneListing.create({
      data: {
        brand: data.brand,
        model: data.model,
        price: parseFloat(data.price),
        condition: data.condition,
        storage: data.storage,
        description: data.description || '',
        images: data.images || [],
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        status: 'PENDING'
      }
    });

    console.log('Phone listing created successfully:', listing);

    return NextResponse.json({ 
      success: true, 
      listing 
    });
  } catch (error) {
    console.error('Detailed phone listing creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create phone listing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all approved listings
    const listings = await prisma.phoneListing.findMany({
      where: {
        status: 'APPROVED'
      },
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