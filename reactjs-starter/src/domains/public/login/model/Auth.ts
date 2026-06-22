export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  name: string;
  role: 'MEMBER' | 'ADMIN';
  expiresIn: number;
}

export interface AuthUser {
  userId: number;
  name: string;
  role: 'MEMBER' | 'ADMIN';
  token: string;
}
