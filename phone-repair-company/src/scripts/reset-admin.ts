import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all existing users
    console.log('Deleting all existing users...');
    // @ts-expect-error - Prisma model not recognized properly
    await prisma.user.deleteMany({});
    console.log('All users deleted successfully');

    // Create a new admin user
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // @ts-expect-error - Prisma model not recognized properly
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        username,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:');
    console.log('ID:', adminUser.id);
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Role:', adminUser.role);
    
    console.log('\nYou can now login using these credentials');
  } catch (error) {
    console.error('Error resetting admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 