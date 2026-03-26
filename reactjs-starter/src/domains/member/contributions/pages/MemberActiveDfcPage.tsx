import React, { useEffect } from "react";
import { Header } from "@/shared/components/shared/Header";
import { useActiveDfcViewModel } from "@/domains/member/home/viewModels/useActiveDfcViewModel";
import { AlertCircle, Users } from "lucide-react";
import { Button } from "@/shared/components/shared/Button";

export function MemberActiveDfcPage() {
  const { data, loading, error, fetchActiveDfc } = useActiveDfcViewModel();

  useEffect(() => {
    fetchActiveDfc();
  }, [fetchActiveDfc]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading DFC...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      <Header />
      
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        {/* DFC Details Card */}
        <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h2 className="mb-6 text-foreground font-semibold text-lg">DFC Details</h2>
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 p-5 bg-accent/40 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">For</span>
              <span className="text-foreground font-medium">{data?.deceasedName || "Late Shri Ramesh Sharma"}</span>
              <span className="text-sm text-muted-foreground">Batch {data?.batchYear || 1985}</span>
            </div>

            <div className="border-t border-border pt-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Event Initiated Date</span>
                <span className="text-foreground font-medium">{data?.eventInitiatedDate || "March 15, 2026"}</span>
                <span className="text-xs text-muted-foreground font-medium text-orange-600">10 days remaining</span>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
                <div className="flex items-baseline justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Your Contribution</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-bold text-primary">₹{data?.dfcAmount || 500}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Progress */}
        <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground font-semibold text-lg">Community Progress</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            See how our community is coming together to support this family
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-muted-foreground text-sm font-medium">Members Contributed</span>
              <span className="text-2xl font-bold text-green-700">{data?.membersContributed || 142}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border/50">
              <span className="text-muted-foreground text-sm font-medium">Members Pending</span>
              <span className="text-2xl font-bold text-foreground">{data?.membersPending || 28}</span>
            </div>

            <div className="pt-3">
              <Button variant="outline" className="w-full">
                View Event Summary
              </Button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col gap-3 pt-2">
          {/* Community Reinforcement Message */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-center text-blue-900 text-sm leading-relaxed">
              <span className="font-semibold">{data?.membersContributed || 142} members</span> have already contributed. <span className="opacity-80">Be part of this support.</span>
            </p>
          </div>
          
          <Button className="w-full h-12 text-base font-semibold">
            Pay Securely Online
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-semibold"
          >
            Remind Me Later
          </Button>

          {/* Informational Text */}
          <div className="px-2 pt-2">
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              Offline contribution options may be enabled in future.
            </p>
          </div>
        </section>

        <div className="mt-2 text-center">
          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
            Your contribution supports the bereaved family with dignity and care
          </p>
        </div>
      </main>
    </div>
  );
}
