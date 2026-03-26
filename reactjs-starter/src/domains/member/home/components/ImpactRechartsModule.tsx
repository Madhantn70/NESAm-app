import React from "react";
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
  ResponsiveContainer
} from "recharts";
import { MemberImpactStatsResponse } from "@/features/models/api/member";

interface ImpactRechartsModuleProps {
  activeTab: "overview" | "trends" | "batch" | "closed";
  stats: MemberImpactStatsResponse;
}

export function ImpactRechartsModule({ activeTab, stats }: ImpactRechartsModuleProps) {

  return (
    <div className="p-6">
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-center font-medium">Program Overview</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-accent/40 border border-border/60 rounded-lg p-4">
              <p className="text-sm text-foreground mb-1 font-medium">Membership Growth</p>
              <p className="text-2xl font-semibold text-primary">{stats.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Active members today</p>
            </div>
            <div className="bg-accent/40 border border-border/60 rounded-lg p-4">
              <p className="text-sm text-foreground mb-1 font-medium">DFC Collection Rate</p>
              <p className="text-2xl font-semibold text-primary">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Collection vs payout transparency</p>
            </div>
            <div className="bg-accent/40 border border-border/60 rounded-lg p-4">
              <p className="text-sm text-foreground mb-1 font-medium">Community Impact</p>
              <p className="text-2xl font-semibold text-primary">{stats.familiesSupported} families</p>
              <p className="text-xs text-muted-foreground mt-1">Supported with dignity</p>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === "trends" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-center font-medium">Growth & DFC Trends</h3>
          
          {/* Membership Growth Chart */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">Membership Growth</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height={192}>
                <LineChart data={stats.membershipGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e0ddd8", borderRadius: "8px", fontSize: "14px" }} />
                  <Line type="monotone" dataKey="members" stroke="#0d7377" strokeWidth={2} dot={{ fill: "#0d7377", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DFC Collected vs Paid Chart */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">DFC Collected vs Paid</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={stats.dfcTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                  <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(1)}L`} contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e0ddd8", borderRadius: "8px", fontSize: "14px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} iconType="circle" />
                  <Bar dataKey="collected" fill="#0d7377" name="Collected" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paid" fill="#14b8a6" name="Paid" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Batch Impact Tab */}
      {activeTab === "batch" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-center font-medium">Batch & Department Impact</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height={224}>
              <BarChart data={stats.batchImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" />
                <XAxis dataKey="batch" tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e0ddd8", borderRadius: "8px", fontSize: "14px" }} />
                <Bar dataKey="families" fill="#0d7377" name="Families" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Closed Events Tab */}
      {activeTab === "closed" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-center font-medium">Recently Closed Events</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height={224}>
              <BarChart data={stats.closedEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} stroke="#e0ddd8" />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e0ddd8", borderRadius: "8px", fontSize: "14px" }} />
                <Bar dataKey="events" fill="#0d7377" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent/40 border border-border/60 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Events</p>
              <p className="text-lg font-semibold text-foreground">14</p>
            </div>
            <div className="bg-accent/40 border border-border/60 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Payout</p>
              <p className="text-lg font-semibold text-foreground">₹393k</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
