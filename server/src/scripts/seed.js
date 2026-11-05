import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Destination } from '../models/Destination.js';
import { seedDestinations } from '../data/seedData.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

export const seedDatabase = async (exitOnComplete = true) => {
  try {
    console.log('[Seed] Seeding database...');

    // Clear existing destinations and demo users if needed
    await Destination.deleteMany({});
    
    // Check if admin exists, if not create default admin
    let adminUser = await User.findOne({ email: 'admin@hiddenharyana.org' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Haryana Tourism Admin',
        email: 'admin@hiddenharyana.org',
        password: 'AdminPassword123!',
        role: 'admin',
      });
      console.log('[Seed] Default Admin Created: admin@hiddenharyana.org / AdminPassword123!');
    }

    // Attach admin as creator to destinations
    const destinationsWithCreator = seedDestinations.map((dest) => ({
      ...dest,
      createdBy: adminUser._id,
    }));

    await Destination.insertMany(destinationsWithCreator);
    console.log(`[Seed] Successfully seeded ${destinationsWithCreator.length} authentic Haryana destinations!`);

    if (exitOnComplete) {
      console.log('[Seed] Seeding complete. Exiting.');
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase(true);
  })();
}
