import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Extended user type to include role and id
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
  role: string;
}

// Helper function to upload images to Supabase Storage
async function uploadImagesToSupabase(images: string[], listingId: string): Promise<string[]> {
  const imageUrls: string[] = [];
  
  for (let i = 0; i < images.length; i++) {
    // Convert base64 to buffer
    const base64Data = images[i].split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate a unique filename
    const filename = `${listingId}_${i}_${Date.now()}.jpg`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('phone-listings')
      .upload(`images/${filename}`, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      continue;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('phone-listings')
      .getPublicUrl(`images/${filename}`);
    
    imageUrls.push(publicUrl);
  }
  
  return imageUrls;
}

// POST - Create a new phone listing
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = session.user as ExtendedUser;
    
    // Parse request body
    const body = await req.json();
    const { brand, model, storage, condition, price, description, images } = body;
    
    // Validate required fields
    if (!brand || !model || !storage || !condition || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create the phone listing in the database
    // @ts-expect-error - New Prisma model not recognized by TypeScript
    const listing = await prisma.phoneListing.create({
      data: {
        brand,
        model,
        storage,
        condition,
        price: parseFloat(price),
        description,
        images: [], // Will be updated after upload
        userId: user.id,
        status: 'pending'
      }
    });
    
    // Upload images to Supabase Storage if provided
    if (images && images.length > 0) {
      const imageUrls = await uploadImagesToSupabase(images, listing.id);
      
      // Update the listing with image URLs
      // @ts-expect-error - New Prisma model not recognized by TypeScript
      await prisma.phoneListing.update({
        where: { id: listing.id },
        data: { images: imageUrls }
      });
      
      // Update the listing object for the response
      listing.images = imageUrls;
    }
    
    // Send notification to admins about new listing
    // @ts-expect-error - New Prisma model not recognized by TypeScript
    await prisma.notification.create({
      data: {
        title: 'New Phone Listing',
        message: `A new ${brand} ${model} has been listed for sale and needs approval.`,
        type: 'info'
      }
    });
    
    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('Error creating phone listing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create phone listing' },
      { status: 500 }
    );
  }
}

// GET - Get all phone listings (with filtering)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    
    // Parse query parameters for filtering
    const status = url.searchParams.get('status') || 'approved'; // Default to approved listings
    const brand = url.searchParams.get('brand');
    const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
    const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;
    
    // Build filter object
    const filter: {
      status: string;
      brand?: string;
      price?: {
        gte?: number;
        lte?: number;
      };
    } = { status };
    
    if (brand) {
      filter.brand = brand;
    }
    
    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      
      if (minPrice !== undefined) {
        filter.price.gte = minPrice;
      }
      
      if (maxPrice !== undefined) {
        filter.price.lte = maxPrice;
      }
    }
    
    // Get listings with filters
    // @ts-expect-error - New Prisma model not recognized by TypeScript
    const listings = await prisma.phoneListing.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching phone listings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch phone listings' },
      { status: 500 }
    );
  }
} 