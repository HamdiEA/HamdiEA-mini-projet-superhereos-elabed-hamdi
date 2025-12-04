export interface Hero {
  _id: string;
  nom: string;
  alias: string;
  univers: 'Marvel' | 'DC' | 'Autre';
  pouvoirs: string[];
  description: string;
  image: string;
  origine: string;
  premiereApparition: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}