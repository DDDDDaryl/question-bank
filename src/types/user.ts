export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  subscribedTags: string[];
  role: UserRole;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  subscribedTags: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  subscribedTags?: string[];
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  password?: string;
  subscribedTags?: string[];
} 