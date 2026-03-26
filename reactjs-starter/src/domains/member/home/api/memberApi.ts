import { USE_MOCK } from "@/shared/constants/config";
import { mockMemberApi } from "@/domains/member/home/mocks/memberMock";
import api from "@/core/api/axiosInstance";
import {
  MemberDashboardSummaryResponse,
  MemberActiveDfcResponse,
  MemberImpactStatsResponse,
  MemberImpactStatsRequest
} from "@/domains/member/home/models/api/member";

export const memberApi = {
  getDashboardSummary: async (): Promise<MemberDashboardSummaryResponse> => {
    if (USE_MOCK) return mockMemberApi.getDashboardSummary();
    const response = await api.get("/member/dashboard/summary");
    return response.data;
  },

  getActiveDfcDetails: async (): Promise<MemberActiveDfcResponse> => {
    if (USE_MOCK) return mockMemberApi.getActiveDfcDetails();
    const response = await api.get("/member/dfc/active");
    return response.data;
  },

  getImpactStats: async (
    req: MemberImpactStatsRequest
  ): Promise<MemberImpactStatsResponse> => {
    if (USE_MOCK) return mockMemberApi.getImpactStats(req);
    const response = await api.post("/member/impact/stats", req);
    return response.data;
  }
};
