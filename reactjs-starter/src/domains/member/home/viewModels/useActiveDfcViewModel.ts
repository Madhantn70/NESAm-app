import { useState, useCallback } from "react";
import { memberApi } from "@/domains/member/home/api/memberApi";
import { MemberActiveDfcResponse } from "@/domains/member/home/models/api/member";

export const useActiveDfcViewModel = () => {
  const [data, setData] = useState<MemberActiveDfcResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveDfc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await memberApi.getActiveDfcDetails();
      setData(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to load active DFC details");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchActiveDfc
  };
};
