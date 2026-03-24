export interface LoginRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}
