import MockAdapter from 'axios-mock-adapter';
import { RegistrationResponse } from '../model/Registration';

export const registerRegistrationMocks = (adapter: MockAdapter) => {
  adapter.onPost('/api/auth/register').reply((config) => {
    const data = JSON.parse(config.data);
    
    if (data.email === 'taken@nesam.in') {
      return [409, { message: 'Email already exists' }];
    }

    const response: RegistrationResponse = {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      email: data.email,
      role: data.role || 'MEMBER',
      createdAt: new Date().toISOString(),
    };

    return [200, response];
  });
};
