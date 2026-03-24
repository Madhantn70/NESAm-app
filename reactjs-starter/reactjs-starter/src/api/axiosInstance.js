import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Logger
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`%c [API Request] ${config.method.toUpperCase()} - ${config.url}`, 'color: #007bff; font-weight: bold', config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response & Error Handler
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`%c [API Response] ${response.status} - ${response.config.url}`, 'color: #28a745; font-weight: bold', response.data);
    return response;
  },
  (error) => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
    
    if (!expectedError) {
      // Log server crashes or network issues to an external service or console
      console.error('%c [API Critical Error]', 'color: #dc3545; font-weight: bold', error.message);
    } else {
      // Handle specific status codes
      console.warn(`%c [API Client Error] ${error.response.status}`, 'color: #ffc107; font-weight: bold', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;