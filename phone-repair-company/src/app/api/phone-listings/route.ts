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
        images: Array.isArray(data.images) ? JSON.stringify(data.images) : (data.images || '[]'),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    console.log('Public phone listings requested with status:', status);
    
    // Set up filter object
    const filter: { status?: string } = {};
    
    // Apply status filter if provided
    if (status && status.toLowerCase() !== 'all') {
      filter.status = status.toUpperCase();
    } else if (status && status.toLowerCase() === 'all') {
      // Don't add any status filter if 'all' is requested - show everything
    } else {
      // Default to only approved listings if no status provided
      filter.status = 'APPROVED';
    }
    
    console.log('Using filter:', filter);
    
    // Get listings with applied filters
    const listings = await prisma.phoneListing.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${listings.length} listings`);
    
    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Error fetching phone listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone listings' },
      { status: 500 }
    );
  }
} 