import { useState, useEffect } from "react";
import { homeApi } from "../api/homeApi";
import { mapImpactStatsApiToView } from "../mappers/homeMapper";
import { ImpactStatsView } from "../models/view/home";

export const useImpactStatsViewModel = () => {
  const [data, setData] = useState<ImpactStatsView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await homeApi.getImpactStats();
        if (mounted) {
          setData(mapImpactStatsApiToView(response));
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load impact stats");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
};
