import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Validate status
    if (!['PENDING', 'APPROVED', 'SOLD', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update phone listing
    const updatedListing = await prisma.phoneListing.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error('Error updating phone listing:', error);
    return NextResponse.json(
      { error: 'Failed to update phone listing' },
      { status: 500 }
    );
  }
} 