// src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creditsea';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Check if admin exists
    const adminExists = await User.findOne({ role: UserRole.ADMIN });
    
    if (!adminExists) {
      // Create admin user
      const admin = new User({
        email: 'admin@creditsea.com',
        password: 'admin123', // This will be hashed by the pre-save hook
        name: 'System Admin',
        role: UserRole.ADMIN
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    mongoose.disconnect();
    console.log('Done seeding');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();