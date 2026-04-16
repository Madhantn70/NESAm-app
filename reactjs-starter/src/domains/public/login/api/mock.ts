import MockAdapter from 'axios-mock-adapter';
import { LoginResponse } from '../model/Auth';

export const registerLoginMocks = (adapter: MockAdapter) => {
  adapter.onPost('/api/auth/login').reply((config) => {
    const data = JSON.parse(config.data);

    if (data.email === 'wrong@nesam.in') {
      return [401, { message: 'Invalid credentials' }];
    }

    const response: LoginResponse = {
      token: 'fake-jwt-token-12345',
      refreshToken: 'fake-refresh-token-67890',
      userId: 1,
      name: 'Demonstration User',
      role: data.email === 'admin@nesam.in' ? 'ADMIN' : 'MEMBER',
      expiresIn: 3600,
    };

    return [200, response];
  });
};
