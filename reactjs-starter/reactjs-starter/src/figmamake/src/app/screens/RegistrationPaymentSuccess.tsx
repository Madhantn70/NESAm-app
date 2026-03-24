import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { CheckCircle, Download, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { 
  MembershipType, 
  calculateTotalPayable 
} from "../utils/contributionCalculator";

export default function RegistrationPaymentSuccess() {
  const navigate = useNavigate();

  // Mock data - would come from payment context/state
  // Using 36-40 years slab with Patron + Founding as example
  const membershipFee = 7000;
  const advanceDFC = 2500;
  const membershipType = MembershipType.PatronFounding;
  const calculation = calculateTotalPayable(membershipFee, advanceDFC, membershipType);
  
  const transactionRef = "TXN202603201545ABC123";
  const memberNumber = 1451;

  const handleGoToDashboard = () => {
    navigate("/member/home");
  };

  const handleExploreImpact = () => {
    navigate("/member/impact");
  };

  const handleDownloadReceipt = () => {
    alert("Downloading receipt...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col">
        <div className="flex flex-col gap-8">
          {/* Large Success Icon - Strong Visual Hierarchy */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center shadow-lg">
              <CheckCircle className="size-16 text-success" strokeWidth={2.5} />
            </div>
            <h1 className="text-foreground text-center">
              Payment Successful!
            </h1>
          </div>

          {/* Member Number Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/30">
              <span className="text-primary font-semibold text-lg">
                You are Member #{memberNumber}
              </span>
            </div>
          </div>

          {/* Contribution Summary Card */}
          <div className="bg-white rounded-xl border-2 border-success/30 p-6 shadow-md">
            <h2 className="text-foreground mb-4 text-center">
              Contribution Summary
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* Total Paid - Prominent */}
              <div className="bg-success/5 rounded-lg p-4 border-2 border-success/20">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Total Paid</span>
                  <span className="text-2xl font-bold text-success">
                    ₹{calculation.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Breakdown */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membership Contribution</span>
                  <span className="text-foreground font-medium">
                    ₹{calculation.membershipAfterDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Advance DFC Contribution</span>
                  <span className="text-foreground font-medium">
                    ₹{calculation.advanceDFC.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Transaction Reference */}
              <div className="mt-2 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Transaction Reference ID</span>
                  <span className="text-xs text-foreground font-mono break-all">
                    {transactionRef}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Impact Message */}
          <div className="bg-primary/5 rounded-xl border-2 border-primary/20 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                <TrendingUp className="size-6 text-primary" />
              </div>
              <p className="text-foreground leading-relaxed">
                Your advance contribution helps families receive timely support.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            {/* Primary Action */}
            <Button 
              onClick={handleGoToDashboard}
              className="w-full h-12 text-base"
            >
              Go to Dashboard
            </Button>

            {/* Secondary Action */}
            <Button 
              onClick={handleExploreImpact}
              variant="outline"
              className="w-full h-12 text-base"
            >
              Explore Community Impact
            </Button>

            {/* Text Link - Download Receipt */}
            <div className="text-center pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                <Download className="size-4" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}