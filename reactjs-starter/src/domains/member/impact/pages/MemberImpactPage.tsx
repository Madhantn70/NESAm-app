import React, { useEffect } from "react";
import { Header } from "@/shared/components/shared/Header";
import { useMemberImpactViewModel } from "@/domains/member/home/viewModels/useMemberImpactViewModel";
import { Filter, Heart } from "lucide-react";
import { ImpactRechartsModule } from "@/domains/member/home/components/ImpactRechartsModule";

export function MemberImpactPage() {
  const vm = useMemberImpactViewModel();

  useEffect(() => {
    vm.fetchImpactStats();
  }, [vm.fetchImpactStats]);

  if (vm.loading && !vm.data) {
    return <div className="min-h-screen flex items-center justify-center">Loading Impact Data...</div>;
  }
  if (vm.error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{vm.error}</div>;
  }

  const hasActiveFilters = vm.selectedBatch !== "all" || vm.selectedDepartment !== "all";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      <Header />
      
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Global Filters */}
        <section className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-foreground font-semibold">Filter Impact Statistics</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-foreground font-medium mb-1">Batch Year</label>
              <select 
                value={vm.selectedBatch} 
                onChange={(e) => vm.setSelectedBatch(e.target.value)}
                className="w-full h-11 px-3 border border-border rounded-lg text-sm bg-white"
              >
                <option value="all">All Batches</option>
                <option value="1980-1985">1980-1985</option>
                <option value="1986-1990">1986-1990</option>
                <option value="1991-1995">1991-1995</option>
                <option value="1996-2000">1996-2000</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-foreground font-medium mb-1">Department</label>
              <select 
                value={vm.selectedDepartment} 
                onChange={(e) => vm.setSelectedDepartment(e.target.value)}
                className="w-full h-11 px-3 border border-border rounded-lg text-sm bg-white"
              >
                <option value="all">All Depts</option>
                <option value="cse">CSE</option>
                <option value="ece">ECE</option>
                <option value="mech">MECH</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing filtered results</p>
                <button
                  onClick={vm.resetFilters}
                  className="text-sm text-primary font-medium hover:underline cursor-pointer focus:outline-none"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Recent Community Support Section */}
        {vm.data && vm.data.recentSupport.length > 0 && (
          <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-foreground mb-4 font-semibold">Recent Community Support</h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Recent support events completed with dignity and care. All information is anonymized to protect privacy.
            </p>
            
            <div className="flex flex-col gap-3">
              {vm.data.recentSupport.slice(0, 3).map((support) => (
                <div key={support.id} className="bg-accent/30 rounded-xl border border-border/60 p-5">
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
                    <p className="text-lg font-semibold text-primary mt-1">{support.amountRange}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed italic">
                      Supported with dignity by NESAm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabbed Chart Section */}
        {vm.data && (
          <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="grid grid-cols-4 border-b border-border">
              {(["overview", "trends", "batch", "closed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => vm.setActiveTab(tab)}
                  className={`py-3 px-2 text-sm font-medium transition-colors border-b-2 capitalize cursor-pointer focus:outline-none ${
                    vm.activeTab === tab
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Recharts Container */}
            <ImpactRechartsModule activeTab={vm.activeTab} stats={vm.data} />
          </section>
        )}
      </main>
    </div>
  );
}
