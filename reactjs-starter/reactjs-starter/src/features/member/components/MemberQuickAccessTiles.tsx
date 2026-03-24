import React from "react";
import { FileText, TrendingUp, Receipt, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MemberQuickAccessTiles() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-foreground text-lg font-semibold">Quick Access</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => navigate("/member/active-dfc")}
          className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <span className="text-center text-sm text-foreground font-medium leading-snug">Active DFC</span>
        </button>

        <button 
          onClick={() => navigate("/member/impact")}
          className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <span className="text-center text-sm text-foreground font-medium leading-snug">Impact & Transparency</span>
        </button>

        <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <span className="text-center text-sm text-foreground font-medium leading-snug">My Receipts</span>
        </button>

        <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-center text-sm text-foreground font-medium leading-snug">Help / FAQ</span>
        </button>
      </div>
    </section>
  );
}
