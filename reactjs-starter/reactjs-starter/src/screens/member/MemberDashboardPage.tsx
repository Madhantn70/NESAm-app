import React, { useEffect } from "react";
import { Header } from "../../components/shared/Header";
import { useMemberDashboardViewModel } from "../../features/member/viewModels/useMemberDashboardViewModel";
import { useNavigate } from "react-router-dom";
import { MemberGreeting } from "../../features/member/components/MemberGreeting";
import { MemberActiveDfcAlert } from "../../features/member/components/MemberActiveDfcAlert";
import { MemberStatusCard } from "../../features/member/components/MemberStatusCard";
import { MemberImpactCard } from "../../features/member/components/MemberImpactCard";
import { MemberQuickAccessTiles } from "../../features/member/components/MemberQuickAccessTiles";

export function MemberDashboardPage() {
  const { data, loading, error, fetchDashboard } = useMemberDashboardViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      <Header />
      <MemberGreeting memberName={data?.memberName || "Member"} />

      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col gap-6">
        <MemberActiveDfcAlert 
          hasActiveDFC={data?.hasActiveDFC || false} 
          contributionDueDate={data?.contributionDueDate} 
        />
        
        <MemberStatusCard 
          memberSince={data?.memberSince || 0} 
          hasPendingDFC={data?.hasPendingDFC || false} 
        />

        <MemberImpactCard 
          familiesSupported={data?.familiesSupported || 0} 
        />

        {/* Next Actions */}
        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-lg font-semibold">Next Actions</h2>
          <button className="bg-white rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all focus:outline-none">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">My Payments & Receipts</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-6 h-6 text-primary"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        </section>

        <MemberQuickAccessTiles />
      </main>
    </div>
  );
}
