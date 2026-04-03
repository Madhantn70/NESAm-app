import React, { useEffect } from "react";
import { Header } from "../../components/shared/Header";
import { useMemberDashboardViewModel } from "../../features/member/viewModels/useMemberDashboardViewModel";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCw, AlertCircle } from "lucide-react";
import { MemberGreeting } from "../../features/member/components/MemberGreeting";
import { MemberActiveDfcAlert } from "../../features/member/components/MemberActiveDfcAlert";
import { MemberStatusCard } from "../../features/member/components/MemberStatusCard";
import { MemberImpactCard } from "../../features/member/components/MemberImpactCard";
import { MemberQuickAccessTiles } from "../../features/member/components/MemberQuickAccessTiles";

export function MemberDashboardPage() {
  const { data, user, loading, error, fetchDashboard } = useMemberDashboardViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Loading your dashboard...</h2>
        <p className="text-muted-foreground mt-2">Fetching the latest DFC updates</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Failed to load dashboard</h2>
        <p className="text-muted-foreground mt-2 mb-6">{error}</p>
        <button 
          onClick={() => fetchDashboard()}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      <Header />
      
      <div className="w-full max-w-md mx-auto pt-4 px-4 flex justify-between items-center">
        <button 
          onClick={() => fetchDashboard()}
          disabled={loading}
          className="p-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <MemberGreeting memberName={user?.fullName || data?.memberName || "Member"} />

      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col gap-6">
        <MemberActiveDfcAlert 
          hasActiveDFC={data?.hasActiveDFC || false} 
          activeDfcCount={data?.activeDfcCount ?? 0}
          contributionDueDate={data?.contributionDueDate} 
        />
        
        <MemberStatusCard 
          memberSince={data?.memberSince ?? "-"} 
          hasPendingDFC={data?.hasPendingDFC || false} 
          status={data?.status ?? "Active"}
          membershipPaid={data?.membershipPaid ?? true}
        />

        <MemberImpactCard 
          familiesSupported={data?.familiesSupported ?? 0} 
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
