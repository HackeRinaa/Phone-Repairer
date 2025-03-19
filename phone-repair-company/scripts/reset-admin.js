const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Initialize Prisma Client
const prisma = new PrismaClient();

async function resetAdminUsers() {
  try {
    console.log('Deleting all existing admin users...');
    
    // Delete all existing admin users
    await prisma.adminUser.deleteMany({});
    
    console.log('Creating new admin user...');
    
    // Create new admin user with default credentials
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newAdmin = await prisma.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator'
      }
    });
    
    console.log('New admin user created successfully:');
    console.log(`Username: admin`);
    console.log(`Password: admin123`);
    console.log(`ID: ${newAdmin.id}`);
    
  } catch (error) {
    console.error('Error resetting admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
resetAdminUsers(); 