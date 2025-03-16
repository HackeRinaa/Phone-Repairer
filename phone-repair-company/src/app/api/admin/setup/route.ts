import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

// This is a one-time setup route to create the admin user
// In a production environment, you would want to secure this route
export async function GET() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.adminUser.findFirst({
      where: {
        username: 'admin'
      }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        success: false
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator'
      }
    });

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      success: true
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 