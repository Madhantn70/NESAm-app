import {
  MemberDashboardSummaryResponse,
  MemberActiveDfcResponse,
  MemberImpactStatsResponse,
  MemberImpactStatsRequest
} from "../models/api/member";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMemberApi = {
  getDashboardSummary: async (): Promise<MemberDashboardSummaryResponse> => {
    await delay(800);
    return {
      memberName: "Rajesh Kumar",
      memberSince: 2024,
      hasPendingDFC: false,
      familiesSupported: 12,
      hasActiveDFC: true,
      contributionDueDate: "2026-03-27"
    };
  },

  getActiveDfcDetails: async (): Promise<MemberActiveDfcResponse> => {
    await delay(1000);
    return {
      dfcAmount: 500,
      batchYear: 1995,
      eventInitiatedDate: "March 15, 2026",
      deceasedName: "Late Shri Ramesh Sharma",
      membersContributed: 142,
      membersPending: 28
    };
  },

  getImpactStats: async (req: MemberImpactStatsRequest): Promise<MemberImpactStatsResponse> => {
    await delay(1200);

    const isFiltered = req.batch && req.batch !== "all";

    if (isFiltered) {
      return {
        totalMembers: 235,
        familiesSupported: 28,
        dfcEvents: 28,
        totalPayoutLakhs: "7.8L",
        membershipGrowth: [],
        dfcTrends: [],
        batchImpact: [],
        closedEvents: [],
        recentSupport: []
      };
    }

    return {
      totalMembers: 1450,
      familiesSupported: 156,
      dfcEvents: 156,
      totalPayoutLakhs: "42.6L",
      membershipGrowth: [
        { id: "member-mg-2020", year: "2020", members: 850 },
        { id: "member-mg-2021", year: "2021", members: 920 },
        { id: "member-mg-2022", year: "2022", members: 1050 },
        { id: "member-mg-2023", year: "2023", members: 1180 },
        { id: "member-mg-2024", year: "2024", members: 1320 },
        { id: "member-mg-2025", year: "2025", members: 1450 }
      ],
      dfcTrends: [
        { id: "member-dfc-2020", year: "2020", collected: 425000, paid: 425000 },
        { id: "member-dfc-2021", year: "2021", collected: 510000, paid: 510000 },
        { id: "member-dfc-2022", year: "2022", collected: 680000, paid: 680000 },
        { id: "member-dfc-2023", year: "2023", collected: 745000, paid: 745000 },
        { id: "member-dfc-2024", year: "2024", collected: 820000, paid: 820000 },
        { id: "member-dfc-2025", year: "2025", collected: 935000, paid: 935000 }
      ],
      batchImpact: [
        { id: "member-batch-1", batch: "1980-85", families: 12 },
        { id: "member-batch-2", batch: "1986-90", families: 18 },
        { id: "member-batch-3", batch: "1991-95", families: 22 },
        { id: "member-batch-4", batch: "1996-00", families: 15 },
        { id: "member-batch-5", batch: "2001-05", families: 9 }
      ],
      closedEvents: [
        { id: "closed-1", month: "Feb", events: 3, payout: 71 },
        { id: "closed-2", month: "Jan", events: 2, payout: 85 },
        { id: "closed-3", month: "Dec", events: 4, payout: 68 },
        { id: "closed-4", month: "Nov", events: 2, payout: 92 },
        { id: "closed-5", month: "Oct", events: 3, payout: 77 }
      ],
      recentSupport: [
        { id: "support-1", batch: "1985", year: 2026, amountRange: "₹70,000 - ₹80,000" },
        { id: "support-2", batch: "1992", year: 2026, amountRange: "₹85,000 - ₹95,000" },
        { id: "support-3", batch: "1988", year: 2025, amountRange: "₹65,000 - ₹75,000" },
        { id: "support-4", batch: "1996", year: 2025, amountRange: "₹75,000 - ₹85,000" },
        { id: "support-5", batch: "1990", year: 2025, amountRange: "₹80,000 - ₹90,000" }
      ]
    };
  }
};
