import { Header } from "../components/Header";
import { UserPlus, CreditCard, Calendar, AlertTriangle, ExternalLink, Plus, Bell, FileDown } from "lucide-react";
import { Button } from "../components/ui/button";

// Mock data for DFC events
const activeDFCEvents = [
  { id: 1, name: "Late Shri Ramesh Sharma (Batch 1985)", collected: 71000, pending: 28, dueDate: "Mar 30, 2026" },
  { id: 2, name: "Late Smt. Priya Verma (Batch 1992)", collected: 64500, pending: 35, dueDate: "Apr 5, 2026" },
  { id: 3, name: "Late Shri Anil Kumar (Batch 1988)", collected: 58000, pending: 42, dueDate: "Apr 12, 2026" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      <main className="w-full max-w-md mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Key Metrics */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">New Members</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-semibold text-primary">12</span>
            </div>
            <span className="text-xs text-muted-foreground">Pending Approval</span>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-secondary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Offline Payments</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-semibold text-foreground">8</span>
            </div>
            <span className="text-xs text-muted-foreground">Pending Verification</span>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Active DFC</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-semibold text-success">3</span>
            </div>
            <span className="text-xs text-muted-foreground">Events Running</span>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-semibold text-destructive">15</span>
            </div>
            <span className="text-xs text-muted-foreground">Contributions</span>
          </div>
        </section>

        {/* DFC Events List */}
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground">Active DFC Events</h2>
          
          <div className="flex flex-col gap-3">
            {activeDFCEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border border-border p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground leading-snug mb-1">{event.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-accent/50 text-muted-foreground rounded border border-border/50">
                        Due: {event.dueDate}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="shrink-0 -mt-1">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-success/5 rounded-lg border border-success/20">
                    <span className="text-xs text-muted-foreground block mb-1">Collected</span>
                    <span className="text-lg font-semibold text-success">₹{(event.collected / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="p-2.5 bg-accent/30 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground block mb-1">Pending</span>
                    <span className="text-lg font-semibold text-foreground">{event.pending}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Actions */}
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground">Admin Actions</h2>
          
          <div className="grid grid-cols-1 gap-2">
            <Button className="w-full justify-start h-11">
              <Plus className="w-5 h-5 mr-2" />
              Create DFC Event
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start h-11">
                <Bell className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
              
              <Button variant="outline" className="justify-start h-11">
                <FileDown className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}