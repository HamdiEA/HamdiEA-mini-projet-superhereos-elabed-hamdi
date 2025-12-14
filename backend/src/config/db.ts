import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadAndTransformHeroes } from '../utils/dataTransformer';

dotenv.config();

// Load and transform heroes from JSON file
const transformedHeroes = loadAndTransformHeroes();

// Initialize database with sample data from SuperHerosComplet.json
const initializeDatabase = async (): Promise<void> => {
  try {
    const Hero = require('../models/Hero').default;
    const User = require('../models/User').default;
    
    // Import heroes from JSON file if collection is empty
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      console.log('Initializing heroes collection from SuperHerosComplet.json...');
      if (transformedHeroes.length > 0) {
        // Remove _id from heroes before inserting to let MongoDB generate new IDs
        const heroesForDB = transformedHeroes.map(({ _id, ...hero }: any) => ({
          ...hero,
          // Ensure all required fields are present
          nom: hero.nom || 'Unknown Hero',
          alias: hero.alias || 'Unknown',
          univers: hero.univers || 'Autre',
          pouvoirs: hero.pouvoirs || ['Unknown powers'],
          description: hero.description || 'No description available',
          image: hero.image || '',
          origine: hero.origine || 'Unknown',
          premiereApparition: hero.premiereApparition || 'Unknown'
        }));
        
        await Hero.insertMany(heroesForDB);
        console.log(`Imported ${heroesForDB.length} heroes from JSON file`);
      } else {
        console.log('JSON file not found, using sample data');
      }
    }
    
    // Create default users if not exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Creating default users...');
      const bcrypt = require('bcryptjs');
      
      const adminUser = new User({
        username: 'admin',
        name: 'Administrator',
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin'
      });
      
      const editorUser = new User({
        username: 'editor',
        name: 'Editor User',
        email: 'editor@example.com', 
        passwordHash: await bcrypt.hash('editor123', 10),
        role: 'editor'
      });
      
      const viewerUser = new User({
        username: 'viewer',
        name: 'Viewer User',
        email: 'viewer@example.com', 
        passwordHash: await bcrypt.hash('viewer123', 10),
        role: 'viewer'
      });
      
      await adminUser.save();
      await editorUser.save();
      await viewerUser.save();
      
      console.log('Default users created successfully');
    }
  } catch (error: any) {
    console.log('Database initialization skipped or failed:', error.message);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export { transformedHeroes as mockHeroes, mockUsers };
export default connectDB;
