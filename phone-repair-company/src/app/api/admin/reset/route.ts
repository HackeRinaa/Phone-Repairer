import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST() {
  try {
    // Delete all existing users
    // @ts-expect-error - Prisma model not recognized properly
    await prisma.user.deleteMany({
      where: {
        role: 'admin'
      }
    });

    // Create a new admin user
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // @ts-expect-error - Prisma model not recognized properly
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        username,
        password: hashedPassword,
        role: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user reset successfully',
      credentials: {
        username,
        password,
      }
    });
  } catch (error) {
    console.error('Error resetting admin user:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reset admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 