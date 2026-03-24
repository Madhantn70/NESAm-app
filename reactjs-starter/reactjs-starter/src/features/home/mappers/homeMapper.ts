import { ImpactStatsApiResponse } from "../models/api/home";
import { ImpactStatsView } from "../models/view/home";

export const mapImpactStatsApiToView = (apiResponse: ImpactStatsApiResponse): ImpactStatsView => {
  return {
    stats: [
      { label: "Total Members", value: apiResponse.total_members.toString(), iconName: "users" },
      { label: "Families Supported", value: apiResponse.families_supported.toString(), iconName: "heart" },
      { label: "DFC Events Conducted", value: apiResponse.dfc_events_conducted.toString(), iconName: "calendar" },
      { label: "Community Support", value: `₹${apiResponse.community_support_in_lakhs}L`, iconName: "rupee" }
    ]
  };
};
