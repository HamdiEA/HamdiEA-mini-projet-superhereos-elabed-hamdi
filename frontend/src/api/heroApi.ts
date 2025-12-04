import axios from 'axios';
import { Hero } from '../types/Hero';

const API_BASE_URL = '/api/heroes';

// Configure axios to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const heroApi = {
  // Get all heroes with optional filters
  getHeroes: async (filters?: {
    search?: string;
    univers?: string;
    sortBy?: string;
  }): Promise<Hero[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.univers) params.append('univers', filters.univers);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await axios.get(`${API_BASE_URL}?${params}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch heroes');
    }
  },

  // Get hero by ID
  getHeroById: async (id: string): Promise<Hero> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch hero');
    }
  },

  // Create new hero
  createHero: async (heroData: FormData): Promise<Hero> => {
    try {
      const response = await axios.post(API_BASE_URL, heroData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create hero');
    }
  },

  // Update hero
  updateHero: async (id: string, heroData: FormData): Promise<Hero> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, heroData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update hero');
    }
  },

  // Delete hero
  deleteHero: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      throw new Error('Failed to delete hero');
    }
  },
};

export default heroApi;