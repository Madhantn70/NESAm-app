import api from "../api/axiosInstance";
import { 
  MemberDashboardSummaryResponse, 
  UserProfileResponse 
} from "../features/member/models/api/member";

export const dashboardApi = {
  getUserProfile: async (): Promise<UserProfileResponse> => {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },

  getDashboardSummary: async (): Promise<MemberDashboardSummaryResponse> => {
    const response = await api.get("/member/home/summary");
    return response.data;
  }
};
