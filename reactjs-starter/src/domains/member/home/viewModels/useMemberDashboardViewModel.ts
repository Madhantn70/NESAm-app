import { useState, useCallback } from "react";
import { memberApi } from "@/domains/member/home/api/memberApi";
import { MemberDashboardSummaryResponse } from "@/domains/member/home/models/api/member";

export const useMemberDashboardViewModel = () => {
  const [data, setData] = useState<MemberDashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await memberApi.getDashboardSummary();
      setData(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchDashboard
  };
};
