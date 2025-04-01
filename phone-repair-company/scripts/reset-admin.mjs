import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envLines = envContent.split('\n');
    
    for (const line of envLines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
        
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
    
    console.log('Loaded environment variables from .env file');
  } catch (error) {
    console.error('Error loading .env file:', error.message);
  }
}

// Load environment variables
loadEnv();

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