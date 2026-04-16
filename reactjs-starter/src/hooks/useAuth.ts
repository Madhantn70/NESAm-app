import { authService } from '../services/authService';

export const useAuth = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  const logout = () => {
    authService.clearSession();
    window.location.href = '/login';
  };

  return { user, isAuthenticated, logout };
};
