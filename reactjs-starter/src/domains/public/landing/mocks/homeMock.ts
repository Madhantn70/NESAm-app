import { ImpactStatsApiResponse } from "@/domains/public/landing/models/api/home";

export const mockGetImpactStats = async (): Promise<ImpactStatsApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total_members: 425,
        families_supported: 48,
        dfc_events_conducted: 48,
        community_support_in_lakhs: 72,
      });
    }, 600); // simulate network delay
  });
};
