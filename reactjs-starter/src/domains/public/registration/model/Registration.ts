export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'MEMBER' | 'ADMIN';
}

export interface RegistrationResponse {
  id: number;
  name: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  createdAt: string;
}
