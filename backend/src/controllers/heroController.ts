import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import Hero, { IHero } from '../models/Hero';
import fs from 'fs';
import path from 'path';
import { mockHeroes, mockUsers } from '../config/db';

// Helper function to check if MongoDB is connected
const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Get all heroes with search and filter
export const getHeroes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, univers, sortBy } = req.query;
    
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      let filtered = [...mockHeroes];
      
      if (search) {
        filtered = filtered.filter(hero =>
          hero.nom.toLowerCase().includes((search as string).toLowerCase()) ||
          hero.alias.toLowerCase().includes((search as string).toLowerCase())
        );
      }
      
      if (univers) {
        filtered = filtered.filter(hero => hero.univers === univers);
      }
      
      if (sortBy === 'name') {
        filtered.sort((a, b) => a.nom.localeCompare(b.nom));
      } else if (sortBy === 'date') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      res.json(filtered);
      return;
    }
    
    // MongoDB query when connected
    let query: any = {};
    
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { alias: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (univers) {
      query.univers = univers;
    }
    
    let sortOptions: any = {};
    if (sortBy === 'name') {
      sortOptions.nom = 1;
    } else if (sortBy === 'date') {
      sortOptions.createdAt = -1;
    }
    
    const heroes = await Hero.find(query).sort(sortOptions);
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching heroes', error });
  }
};

// Get hero by ID
export const getHeroById = async (req: AuthRequest, res: Response): Promise<void> => {
    
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      res.status(404).json({ message: 'Hero not found' });
      return;
    }
    
    res.json(hero);
  
};

// Create new hero
export const createHero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let heroData: any = {
      ...req.body
    };
    
    // Handle powers if sent as string
    if (typeof heroData.pouvoirs === 'string') {
      heroData.pouvoirs = JSON.parse(heroData.pouvoirs);
    }
    
    heroData.image = req.file ? `/uploads/${req.file.filename}` : '';
    
  
    
    // MongoDB query when connected
    const hero = new Hero(heroData);
    const savedHero = await hero.save();
    
    res.status(201).json(savedHero);
  } catch (error) {
    res.status(500).json({ message: 'Error creating hero', error });
  }
};

// Update hero
export const updateHero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let updateData: any = { ...req.body };
    
    // Handle powers if sent as string
    if (typeof updateData.pouvoirs === 'string') {
      updateData.pouvoirs = JSON.parse(updateData.pouvoirs);
    }
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
  
    
    // MongoDB query when connected
    if (req.file) {
      // Delete old image if exists
      const oldHero = await Hero.findById(req.params.id);
      if (oldHero && oldHero.image) {
        const oldImagePath = path.join('uploads', path.basename(oldHero.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!hero) {
      res.status(404).json({ message: 'Hero not found' });
      return;
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hero', error });
  }
};

// Delete hero
export const deleteHero = async (req: AuthRequest, res: Response): Promise<void> => {
  
    
    // MongoDB query when connected
    const hero = await Hero.findByIdAndDelete(req.params.id);
    
    if (!hero) {
      res.status(404).json({ message: 'Hero not found' });
      return;
    }
    
    // Delete associated image
    if (hero.image) {
      const imagePath = path.join('uploads', path.basename(hero.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Hero deleted successfully' });
 
};
