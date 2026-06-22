import { axiosClient } from './axiosClient';
import { setupMocks } from './mockAdapter';

if (import.meta.env.VITE_USE_MOCK === 'true') {
  setupMocks(axiosClient);
}

export default axiosClient;
