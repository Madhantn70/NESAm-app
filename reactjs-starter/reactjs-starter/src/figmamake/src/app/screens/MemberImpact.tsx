import { useState } from "react";
import { Header } from "../components/Header";
import { Users, Heart, Calendar, IndianRupee, ChevronDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for charts
const membershipGrowthData = [
  { id: "member-mg-2020", year: "2020", members: 850 },
  { id: "member-mg-2021", year: "2021", members: 920 },
  { id: "member-mg-2022", year: "2022", members: 1050 },
  { id: "member-mg-2023", year: "2023", members: 1180 },
  { id: "member-mg-2024", year: "2024", members: 1320 },
  { id: "member-mg-2025", year: "2025", members: 1450 },
];

const dfcTrendsData = [
  { id: "member-dfc-2020", year: "2020", collected: 425000, paid: 425000 },
  { id: "member-dfc-2021", year: "2021", collected: 510000, paid: 510000 },
  { id: "member-dfc-2022", year: "2022", collected: 680000, paid: 680000 },
  { id: "member-dfc-2023", year: "2023", collected: 745000, paid: 745000 },
  { id: "member-dfc-2024", year: "2024", collected: 820000, paid: 820000 },
  { id: "member-dfc-2025", year: "2025", collected: 935000, paid: 935000 },
];

const batchImpactData = [
  { id: "member-batch-1", batch: "1980-85", families: 12 },
  { id: "member-batch-2", batch: "1986-90", families: 18 },
  { id: "member-batch-3", batch: "1991-95", families: 22 },
  { id: "member-batch-4", batch: "1996-00", families: 15 },
  { id: "member-batch-5", batch: "2001-05", families: 9 },
];

const closedEventsData = [
  { id: "closed-1", month: "Feb", events: 3, payout: 71 },
  { id: "closed-2", month: "Jan", events: 2, payout: 85 },
  { id: "closed-3", month: "Dec", events: 4, payout: 68 },
  { id: "closed-4", month: "Nov", events: 2, payout: 92 },
  { id: "closed-5", month: "Oct", events: 3, payout: 77 },
];

// Mock data for recent community support - fully anonymized
const recentCommunitySupport = [
  { id: "support-1", batch: "1985", year: 2026, amountRange: "₹70,000 - ₹80,000" },
  { id: "support-2", batch: "1992", year: 2026, amountRange: "₹85,000 - ₹95,000" },
  { id: "support-3", batch: "1988", year: 2025, amountRange: "₹65,000 - ₹75,000" },
  { id: "support-4", batch: "1996", year: 2025, amountRange: "₹75,000 - ₹85,000" },
  { id: "support-5", batch: "1990", year: 2025, amountRange: "₹80,000 - ₹90,000" },
];

export default function MemberImpact() {
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "trends" | "batch" | "closed">("overview");

  // Mock: Filter data based on selections
  // In real app, this would trigger API calls with filter parameters
  const getFilteredStats = () => {
    // Base stats when "all" is selected
    const baseStats = {
      members: 1450,
      families: 156,
      events: 156,
      payout: "42.6L"
    };

    // Example: Reduce stats when specific filters are applied
    if (selectedBatch !== "all" || selectedDepartment !== "all") {
      return {
        members: 235,
        families: 28,
        events: 28,
        payout: "7.8L"
      };
    }

    return baseStats;
  };

  const filteredStats = getFilteredStats();
  const hasActiveFilters = selectedBatch !== "all" || selectedDepartment !== "all";

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />

      <main className="w-full max-w-md mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Global Filters */}
        <section className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-primary" />
            <h2 className="text-foreground">Filter Impact Statistics</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-foreground mb-2">
                Batch Year
              </label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="1980-1985">1980-1985</SelectItem>
                  <SelectItem value="1986-1990">1986-1990</SelectItem>
                  <SelectItem value="1991-1995">1991-1995</SelectItem>
                  <SelectItem value="1996-2000">1996-2000</SelectItem>
                  <SelectItem value="2001-2005">2001-2005</SelectItem>
                  <SelectItem value="2006-2010">2006-2010</SelectItem>
                  <SelectItem value="2011-2015">2011-2015</SelectItem>
                  <SelectItem value="2016-2020">2016-2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground mb-2">
                Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
                  <SelectItem value="cse">CSE</SelectItem>
                  <SelectItem value="ece">ECE</SelectItem>
                  <SelectItem value="eee">EEE</SelectItem>
                  <SelectItem value="mech">MECH</SelectItem>
                  <SelectItem value="civil">CIVIL</SelectItem>
                  <SelectItem value="chemical">CHEM</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing filtered results
                </p>
                <button
                  onClick={() => {
                    setSelectedBatch("all");
                    setSelectedDepartment("all");
                  }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Lifetime Stats - Compact Grid */}
        <section className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <h2 className="text-foreground mb-4 text-center">
            Lifetime Impact
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Active Members */}
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="size-5 text-primary" />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">
                {filteredStats.members}
              </div>
              <div className="text-xs text-muted-foreground">
                Members
              </div>
            </div>

            {/* Families Supported */}
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="size-5 text-primary" />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">
                {filteredStats.families}
              </div>
              <div className="text-xs text-muted-foreground">
                Families
              </div>
            </div>

            {/* DFC Events */}
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-5 text-primary" />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">
                {filteredStats.events}
              </div>
              <div className="text-xs text-muted-foreground">
                Events
              </div>
            </div>

            {/* Total Payout */}
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="size-5 text-primary" />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">
                ₹{filteredStats.payout}
              </div>
              <div className="text-xs text-muted-foreground">
                Payout
              </div>
            </div>
          </div>
        </section>

        {/* Recent Community Support Section */}
        <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-foreground mb-4">
            Recent Community Support
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Recent support events completed with dignity and care. All information is anonymized to protect privacy.
          </p>
          
          <div className="flex flex-col gap-3">
            {recentCommunitySupport.map((support) => (
              <div 
                key={support.id}
                className="bg-gradient-to-br from-accent/50 to-accent/20 rounded-xl border border-border/60 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Batch Year</span>
                    <span className="text-foreground font-medium">{support.batch}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-muted-foreground">Event Year</span>
                    <span className="text-foreground font-medium">{support.year}</span>
                  </div>
                </div>
                
                <div className="mb-3 pb-3 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Support Amount Range</span>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {support.amountRange}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed italic">
                    Supported with dignity by NESAm community
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              No personal or identifying information is displayed to ensure privacy and dignity of supported families.
            </p>
          </div>
        </section>

        {/* Tabbed Chart Section */}
        <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="grid grid-cols-4 border-b border-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "overview"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/30"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "trends"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/30"
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "batch"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/30"
              }`}
            >
              Batch
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "closed"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/30"
              }`}
            >
              Closed
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-foreground text-center">
                  Program Overview
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="bg-accent rounded-lg p-4">
                    <p className="text-sm text-foreground mb-1 font-medium">Membership Growth</p>
                    <p className="text-2xl font-semibold text-primary">1,450</p>
                    <p className="text-xs text-muted-foreground mt-1">Active members today</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4">
                    <p className="text-sm text-foreground mb-1 font-medium">DFC Collection Rate</p>
                    <p className="text-2xl font-semibold text-primary">100%</p>
                    <p className="text-xs text-muted-foreground mt-1">Collection vs payout transparency</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4">
                    <p className="text-sm text-foreground mb-1 font-medium">Community Impact</p>
                    <p className="text-2xl font-semibold text-primary">156 families</p>
                    <p className="text-xs text-muted-foreground mt-1">Supported with dignity</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === "trends" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-foreground text-center">
                  Growth & DFC Trends
                </h3>
                
                {/* Membership Growth Chart */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground text-center">Membership Growth</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={membershipGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" key="member-mg-grid" />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          stroke="#e0ddd8"
                          key="member-mg-xaxis"
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          stroke="#e0ddd8"
                          key="member-mg-yaxis"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e0ddd8",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                          key="member-mg-tooltip"
                        />
                        <Line
                          type="monotone"
                          dataKey="members"
                          stroke="#0d7377"
                          strokeWidth={2}
                          dot={{ fill: "#0d7377", r: 3 }}
                          activeDot={{ r: 5 }}
                          key="member-mg-line"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* DFC Collected vs Paid Chart */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground text-center">DFC Collected vs Paid</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height={192}>
                      <BarChart data={dfcTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" key="member-dfc-grid" />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          stroke="#e0ddd8"
                          key="member-dfc-xaxis"
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          stroke="#e0ddd8"
                          key="member-dfc-yaxis"
                        />
                        <Tooltip
                          formatter={(value) => `₹${(Number(value) / 100000).toFixed(1)}L`}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e0ddd8",
                            borderRadius: "8px",
                            fontSize: "14px",
                          }}
                          key="member-dfc-tooltip"
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                          iconType="circle"
                          key="member-dfc-legend"
                        />
                        <Bar dataKey="collected" fill="#0d7377" name="Collected" radius={[4, 4, 0, 0]} key="member-dfc-bar-collected" />
                        <Bar dataKey="paid" fill="#14b8a6" name="Paid" radius={[4, 4, 0, 0]} key="member-dfc-bar-paid" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Impact Tab */}
            {activeTab === "batch" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-foreground text-center">
                  Batch & Department Impact
                </h3>
                
                {/* Horizontal Bar Chart */}
                <div className="h-56">
                  <ResponsiveContainer width="100%" height={224}>
                    <BarChart data={batchImpactData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" key="member-batch-grid" />
                      <XAxis
                        dataKey="batch"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        stroke="#e0ddd8"
                        key="member-batch-xaxis"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        stroke="#e0ddd8"
                        key="member-batch-yaxis"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0ddd8",
                          borderRadius: "8px",
                          fontSize: "14px",
                        }}
                        key="member-batch-tooltip"
                      />
                      <Bar
                        dataKey="families"
                        fill="#0d7377"
                        name="Families"
                        radius={[4, 4, 0, 0]}
                        key="member-batch-bar"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Closed Events Tab */}
            {activeTab === "closed" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-foreground text-center">
                  Recently Closed Events
                </h3>
                
                <div className="h-56">
                  <ResponsiveContainer width="100%" height={224}>
                    <BarChart data={closedEventsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" key="member-closed-grid" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        stroke="#e0ddd8"
                        key="member-closed-xaxis"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        stroke="#e0ddd8"
                        key="member-closed-yaxis"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0ddd8",
                          borderRadius: "8px",
                          fontSize: "14px",
                        }}
                        key="member-closed-tooltip"
                      />
                      <Bar
                        dataKey="events"
                        fill="#0d7377"
                        radius={[8, 8, 0, 0]}
                        key="member-closed-bar"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-accent rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Events</p>
                    <p className="text-lg font-semibold text-foreground">14</p>
                  </div>
                  <div className="bg-accent rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Payout</p>
                    <p className="text-lg font-semibold text-foreground">₹393k</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}