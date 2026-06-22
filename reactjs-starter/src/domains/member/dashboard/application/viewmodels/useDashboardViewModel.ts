import { useState, useEffect } from 'react';
import { DashboardModel } from '../../domain/models/dashboard.model';
import { mockDashboardData } from '../../infrastructure/mocks/dashboard.mock';
import { mapToDashboardDomain } from '../mappers/dashboard.mapper';

export const useDashboardViewModel = () => {
  const [dashboard, setDashboard] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchDashboard = () => {
      setLoading(true);
      // In the future, replace with an infrastructure service call
      setTimeout(() => {
        const domainData = mapToDashboardDomain(mockDashboardData);
        setDashboard(domainData);
        setLoading(false);
      }, 500); // simulate network delay
    };

    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
  };
};
