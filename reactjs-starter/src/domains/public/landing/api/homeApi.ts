import { ImpactStatsApiResponse } from "@/domains/public/landing/models/api/home";
import { mockGetImpactStats } from "@/domains/public/landing/mocks/homeMock";
import { USE_MOCK } from "@/shared/constants/config";
import api from "@/core/api/axiosInstance"; // Just keeping generic placeholder for future actual routes

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
