import React from "react";

interface MemberStatusCardProps {
  memberSince: number | string;
  hasPendingDFC: boolean;
  status: string;
  membershipPaid: boolean;
}

export function MemberStatusCard({ memberSince, hasPendingDFC, status, membershipPaid }: MemberStatusCardProps) {
  return (
    <section className="bg-gradient-to-br from-white to-accent/20 rounded-xl border-2 border-primary/20 p-6 shadow-sm">
      <h2 className="mb-5 text-foreground text-lg font-semibold">Membership Status</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Status</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
            {status ?? "Active"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Member Since</span>
          <span className="text-foreground font-medium text-sm">{memberSince ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Membership Fee</span>
          <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${
            membershipPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {membershipPaid ? "Paid" : "Pending"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Contribution Due</span>
          {hasPendingDFC ? (
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
              DFC Pending
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
              None
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
