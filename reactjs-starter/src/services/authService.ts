import { LoginResponse } from '../domains/public/login/model/Auth';
import { AuthUser } from '../domains/public/login/model/Auth';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authService = {
  saveSession(response: LoginResponse) {
    const user: AuthUser = {
      userId: response.userId,
      name: response.name,
      role: response.role,
      token: response.token,
    };
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
