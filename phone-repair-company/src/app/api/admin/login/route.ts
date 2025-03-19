import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find the admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { username }
    });
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, adminUser.password);
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Create admin session data
    const adminSession = {
      id: adminUser.id,
      username: adminUser.username,
      name: adminUser.name,
      role: 'admin'
    };
    
    // Set the cookie in the response
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        name: adminUser.name
      }
    });
    
    // Set cookie using the Response object
    response.cookies.set('admin_session', JSON.stringify(adminSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 