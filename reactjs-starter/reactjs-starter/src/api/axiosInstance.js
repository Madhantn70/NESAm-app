import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data, // Automatically unwrap the ApiResponse { success, data, message }
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // 1. Handle 401 Unauthorized -> Token Refresh
    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const refreshResponse = await axios.post(`${axiosInstance.defaults.baseURL}/api/v1/auth/refresh`, {
          refreshToken: refreshToken
        });

        if (refreshResponse.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Idempotent Retry Logic (max 2) - ONLY for GET requests or safe operations
    const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(config.method.toUpperCase());
    const retryCount = config.__retryCount || 0;
    
    if (isSafeMethod && (!response || response.status >= 500) && retryCount < 2) {
      config.__retryCount = retryCount + 1;
      console.warn(`[Axios] Idempotent retry (${config.__retryCount}/2): ${config.url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * config.__retryCount));
      return axiosInstance(config);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;