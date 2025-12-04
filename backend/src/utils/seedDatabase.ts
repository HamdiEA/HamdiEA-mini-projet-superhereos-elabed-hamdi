import Hero from '../models/Hero';
import User from '../models/User';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    // Import heroes from JSON file as specified in PDF
    const jsonFilePath = path.join(__dirname, '..', 'SuperHerosComplet.json');
    
    if (fs.existsSync(jsonFilePath)) {
      // Check if heroes already exist
      const heroesCount = await Hero.countDocuments();
      if (heroesCount === 0) {
        const heroesData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        await Hero.insertMany(heroesData);
        logger.info(`Imported ${heroesData.length} heroes from SuperHerosComplet.json`);
      } else {
        logger.info('Heroes already exist in database');
      }
    } else {
      logger.error('SuperHerosComplet.json file not found!');
    }

    // Create default users for testing (as specified in PDF)
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      // Create default admin user
      const adminUser = new User({
        username: 'admin',
        name: 'Administrator',
        email: 'admin@example.com',
        passwordHash: 'admin123', // Will be hashed by pre-save middleware
        role: 'admin'
      });

      // Create default editor user
      const editorUser = new User({
        username: 'editor',
        name: 'Editor User',
        email: 'editor@example.com', 
        passwordHash: 'editor123', // Will be hashed by pre-save middleware
        role: 'editor'
      });

      await adminUser.save();
      await editorUser.save();
      logger.info('Default users created: admin@example.com (admin123), editor@example.com (editor123)');
    } else {
      logger.info('Users already exist in database');
    }
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

export default seedDatabase;