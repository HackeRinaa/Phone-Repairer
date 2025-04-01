import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful!', result);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 