import axiosInstance from '../api/axiosInstance';

const userService = {
  // POST /api/v1/users/register
  register: async (userData) => {
    const response = await axiosInstance.post('/api/v1/users/register', userData);
    return response.data;
  },

  // POST /api/v1/users/ott/login
  loginWithToken: async (token) => {
    const response = await axiosInstance.post('/api/v1/users/ott/login', JSON.stringify(token));
    return response.data;
  },

  // GET /api/v1/users/ott/dispatch
  dispatchOTT: async () => {
    const response = await axiosInstance.get('/api/v1/users/ott/dispatch');
    return response.data;
  },

  // GET /api/v1/users
  getAllUsers: async () => {
    const response = await axiosInstance.get('/api/v1/users');
    return response.data;
  },

  // GET /api/v1/users/{id}
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/api/v1/users/${id}`);
    return response.data;
  },

  // GET /api/v1/users/test
  testConnection: async () => {
    const response = await axiosInstance.get('/api/v1/users/test');
    return response.data;
  }
};

export default userService;