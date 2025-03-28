import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Extended user type that includes role and id
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
  role: string;
}

// Simple ping endpoint to validate admin authentication
export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    // For the hardcoded admin case, we'll allow the ping if certain query params are provided
    const { searchParams } = new URL(request.url);
    const isLocalAdmin = searchParams.get('adminKey') === 'admin123';
    
    if (isLocalAdmin || (session?.user && (session.user as ExtendedUser).role === 'admin')) {
      console.log('Admin ping successful');
      return NextResponse.json({ success: true, message: 'Admin ping successful' });
    }
    
    console.log('Admin ping unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Error in admin ping:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 