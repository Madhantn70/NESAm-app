import { ImpactStatsApiResponse } from "../models/api/home";
import { mockGetImpactStats } from "../mocks/homeMock";
import { USE_MOCK } from "../../../constants/config";
import api from "../../../api/axiosInstance"; // Just keeping generic placeholder for future actual routes

export const homeApi = {
  getImpactStats: async (): Promise<ImpactStatsApiResponse> => {
    if (USE_MOCK) {
      return mockGetImpactStats();
    }
    // Real implementation would replace this
    const response = await api.get<ImpactStatsApiResponse>("/public/impact-stats");
    return response.data;
  },
};
