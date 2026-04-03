import { useState, useCallback } from "react";
import { dashboardApi } from "../../../services/dashboardApi";
import { MemberDashboardSummaryResponse, UserProfileResponse } from "../models/api/member";

export const useMemberDashboardViewModel = () => {
  const [data, setData] = useState<MemberDashboardSummaryResponse | null>(null);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Concurrently fetch profile and summary
      const [profileResp, summaryResp] = await Promise.all([
        dashboardApi.getUserProfile(),
        dashboardApi.getDashboardSummary()
      ]);
      
      setUser(profileResp);
      setData(summaryResp);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    user,
    loading,
    error,
    fetchDashboard
  };
};
