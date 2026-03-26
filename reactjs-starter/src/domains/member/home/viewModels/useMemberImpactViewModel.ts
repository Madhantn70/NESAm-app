import { useState, useCallback } from "react";
import { memberApi } from "@/domains/member/home/api/memberApi";
import { MemberImpactStatsResponse } from "@/domains/member/home/models/api/member";

export type ImpactTab = "overview" | "trends" | "batch" | "closed";

export const useMemberImpactViewModel = () => {
  const [data, setData] = useState<MemberImpactStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState<ImpactTab>("overview");

  const fetchImpactStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await memberApi.getImpactStats({
        batch: selectedBatch === "all" ? undefined : selectedBatch,
        department: selectedDepartment === "all" ? undefined : selectedDepartment
      });
      setData(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to load impact stats");
    } finally {
      setLoading(false);
    }
  }, [selectedBatch, selectedDepartment]);

  const resetFilters = useCallback(() => {
    setSelectedBatch("all");
    setSelectedDepartment("all");
  }, []);

  return {
    data,
    loading,
    error,
    selectedBatch,
    setSelectedBatch,
    selectedDepartment,
    setSelectedDepartment,
    activeTab,
    setActiveTab,
    fetchImpactStats,
    resetFilters
  };
};
