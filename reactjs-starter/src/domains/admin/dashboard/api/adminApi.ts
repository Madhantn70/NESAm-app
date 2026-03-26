import { getMockAdminDashboard } from "../mocks/adminMock";
import { AdminDashboardData } from "../models/api/admin";

// Assuming standard core axios instance exists at @/core/api/axiosInstance if we weren't mocking.
const USE_MOCK = true;

export const adminApi = {
  getDashboardData: async (): Promise<AdminDashboardData> => {
    if (USE_MOCK) {
      return getMockAdminDashboard();
    }
    throw new Error("Live endpoint not mapped yet.");
  }
};
