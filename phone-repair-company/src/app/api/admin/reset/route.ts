import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // This is a one-time setup endpoint, you should remove it after use
    // or add proper authorization
    
    // Delete all existing admin users
    await prisma.adminUser.deleteMany({});
    
    // Create new admin user with default credentials
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin user reset successfully',
      adminCredentials: {
        username: 'admin',
        password: 'admin123' // This is just for initial setup
      }
    });
  } catch (error) {
    console.error('Failed to reset admin user:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin user' },
      { status: 500 }
    );
  }
} 