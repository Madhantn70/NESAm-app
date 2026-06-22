import { DashboardModel } from '../../domain/models/dashboard.model';

// In the future, this will map the raw API response to the pure Domain model.
// For now, it just passes the mock data directly.
export const mapToDashboardDomain = (apiData: any): DashboardModel => {
  return apiData as DashboardModel;
};
