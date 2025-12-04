import axios from 'axios';
import { User, AuthResponse } from '../types/Hero';

const API_BASE_URL = '/api/auth';

export const authApi = {
  // Register new user - Updated to support public registration
  register: async (userData: {
    username: string;
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user
  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch current user');
    }
  },

  // Get total users count
  getUsersCount: async (): Promise<number> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users-count`);
      return response.data?.count ?? 0;
    } catch (error) {
      throw new Error('Failed to fetch users count');
    }
  },
};

export default authApi;