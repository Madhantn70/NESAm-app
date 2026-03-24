import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { AlertCircle, Users } from "lucide-react";

export default function MemberActiveDFC() {
  const navigate = useNavigate();

  // Mock data - would come from backend
  // Using 36-40 years slab as example (DFC per event = ₹500)
  const dfcAmount = 500; // Official DFC per event amount based on member's age slab
  const batchYear = 1995;
  const eventInitiatedDate = "March 15, 2026";

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      <main className="w-full max-w-md mx-auto px-6 py-6 flex flex-col gap-6">
        {/* DFC Details Card */}
        <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h2 className="mb-6 text-foreground">DFC Details</h2>
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 p-5 bg-accent/40 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">For</span>
              <span className="text-foreground font-medium">Late Shri Ramesh Sharma</span>
              <span className="text-sm text-muted-foreground">Batch 1985</span>
            </div>

            <div className="border-t border-border pt-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Event Initiated Date</span>
                <span className="text-foreground font-medium">{eventInitiatedDate}</span>
                <span className="text-xs text-muted-foreground">10 days remaining</span>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
                <div className="flex items-baseline justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Your Contribution</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-semibold text-primary">₹{dfcAmount}</span>
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
            <h2 className="text-foreground">Community Progress</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            See how our community is coming together to support this family
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
              <span className="text-muted-foreground">Members Contributed</span>
              <span className="text-2xl font-semibold text-success">142</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border/50">
              <span className="text-muted-foreground">Members Pending</span>
              <span className="text-2xl font-semibold text-foreground">28</span>
            </div>

            <div className="pt-3">
              <Button 
                variant="outline" 
                className="w-full"
              >
                View Event Summary
              </Button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col gap-3 pt-2">
          {/* Community Reinforcement Message */}
          <div className="bg-accent rounded-lg p-4 border border-accent-foreground/10">
            <p className="text-center text-foreground leading-relaxed">
              <span className="font-medium text-accent-foreground">142 members</span> have already contributed. <span className="text-muted-foreground">Be part of this support.</span>
            </p>
          </div>
          
          <Button className="w-full h-12 text-base">
            Pay Securely Online
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 text-base"
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

        <div className="mt-2 mx-4 py-4 px-5 bg-accent/30 rounded-lg border-l-4 border-primary/30">
          <p className="text-center text-muted-foreground leading-relaxed">
            Your contribution supports the bereaved family with dignity and care
          </p>
        </div>
      </main>
    </div>
  );
}