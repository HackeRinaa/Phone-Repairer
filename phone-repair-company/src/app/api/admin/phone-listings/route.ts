import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Set up filter object
    const filter: { status?: string } = {};
    
    // Apply status filter if provided
    if (status) {
      filter.status = status.toUpperCase();
    }
    
    // @ts-expect-error - New Prisma model not recognized by TypeScript
    const listings = await prisma.phoneListing.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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