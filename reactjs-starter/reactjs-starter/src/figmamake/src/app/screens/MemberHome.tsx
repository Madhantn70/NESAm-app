import { Bell, User, ChevronRight, FileText, TrendingUp, Receipt, HelpCircle, Users, Clock, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";

export default function MemberHome() {
  const navigate = useNavigate();
  const memberName = "Rajesh Kumar";
  const memberSince = 2024; // Year member joined
  const hasPendingDFC = false; // True if there's a pending DFC contribution
  const familiesSupported = 12; // Number of families helped by member's contributions

  // DFC Contribution Status - Mock data
  // In real app, this would come from API
  const hasActiveDFC = true; // Whether there's an active DFC request
  const contributionDueDate = new Date("2026-03-27"); // March 27, 2026 (7 days from today)
  const today = new Date("2026-03-20"); // Current date based on system context
  
  // Calculate days until due
  const daysUntilDue = Math.ceil((contributionDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0;
  const isWithinDueWindow = daysUntilDue >= 0 && daysUntilDue <= 30; // Show if due within 30 days

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Greeting Section */}
      <div className="w-full bg-accent/40 border-b border-border">
        <div className="w-full max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-foreground">Hi, {memberName}</h1>
          <div className="flex items-center gap-1">
            <button className="p-2.5 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2.5 rounded-lg hover:bg-accent transition-colors">
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
      
      <main className="w-full max-w-md mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Active DFC Card - Priority placement */}
        <section 
          onClick={() => navigate("/member/active-dfc")}
          className="bg-gradient-to-r from-accent to-accent/60 rounded-xl border-2 border-accent-foreground/30 p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col gap-4">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2 items-start flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-foreground font-medium">DFC Request</span>
                  {hasActiveDFC && (
                    <span className="px-2 py-1 bg-accent-foreground/10 text-accent-foreground rounded-md border border-accent-foreground/30 text-sm font-medium">
                      1 Active
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  View and respond to active requests
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-accent-foreground flex-shrink-0" />
            </div>

            {/* Contribution Status */}
            {hasActiveDFC && (
              <div className="pt-4 border-t border-accent-foreground/20">
                {isOverdue ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-destructive/90 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">
                        Contribution Overdue
                      </span>
                    </div>
                  </div>
                ) : isWithinDueWindow ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-foreground" />
                    <span className="text-foreground font-medium">
                      Contribution due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {/* Status Card */}
        <section className="bg-gradient-to-br from-white to-accent/20 rounded-xl border-2 border-primary/20 p-6 shadow-md">
          <h2 className="mb-5 text-foreground">Membership Status</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="px-4 py-2 bg-success/10 text-success rounded-lg border border-success/30 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground font-medium">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Membership Fee</span>
              <span className="px-4 py-2 bg-success/10 text-success rounded-lg border border-success/30 font-medium">Paid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contribution Due</span>
              {hasPendingDFC ? (
                <span className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/30 font-medium">
                  DFC Pending
                </span>
              ) : (
                <span className="px-4 py-2 bg-success/10 text-success rounded-lg border border-success/30 font-medium">
                  None
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Community Impact Card */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/30 p-6 shadow-md">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-foreground">Community Impact</h2>
              <p className="text-foreground leading-relaxed">
                Your contributions helped support <span className="font-semibold text-primary">{familiesSupported} families</span>.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate("/member/impact")}
            className="w-full"
          >
            Explore Community Impact
          </Button>
        </section>

        {/* Next Actions */}
        <section className="flex flex-col gap-4">
          <h2 className="text-foreground">Next Actions</h2>
          
          <button className="bg-white rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1 items-start">
                <span className="text-foreground">My Payments & Receipts</span>
              </div>
              <ChevronRight className="w-6 h-6 text-primary" />
            </div>
          </button>
        </section>

        {/* Quick Access Tiles */}
        <section className="flex flex-col gap-4">
          <h2 className="text-foreground">Quick Access</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-center text-foreground leading-snug">Active DFC</span>
            </button>

            <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-center text-foreground leading-snug">Impact & Transparency</span>
            </button>

            <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <span className="text-center text-foreground leading-snug">My Receipts</span>
            </button>

            <button className="bg-white rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all min-h-[120px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <span className="text-center text-foreground leading-snug">Help / FAQ</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}