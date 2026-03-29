import api from './api';

export const requestToken = async (mobileNumber) => {
  try {
    const response = await api.post('/api/v1/users/ott/token', mobileNumber, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginWithToken = async (token) => {
  try {
    const response = await api.post('/api/v1/users/ott/login', token, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data; // This is the JWT
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
