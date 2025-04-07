export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 