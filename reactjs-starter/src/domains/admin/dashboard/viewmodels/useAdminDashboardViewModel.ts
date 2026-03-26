import { useState, useCallback } from "react";
import { adminApi } from "../api/adminApi";
import { AdminDashboardData } from "../models/api/admin";

export const useAdminDashboardViewModel = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await adminApi.getDashboardData();
      setData(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin dashboard data");
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
