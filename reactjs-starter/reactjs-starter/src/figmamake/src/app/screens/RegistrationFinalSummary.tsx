import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Info, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { 
  MembershipType, 
  calculateTotalPayable, 
  ADVANCE_DFC_EXPLANATION 
} from "../utils/contributionCalculator";

export default function RegistrationFinalSummary() {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isRefundPolicyExpanded, setIsRefundPolicyExpanded] = useState(false);

  // Mock data - in real app, this would come from previous screens
  // Using 36-40 years slab with Patron + Founding member as example
  const ageBand = "36–40 years";
  const membershipFee = 7000;
  const advanceDFC = 2500;
  const dfcPerEvent = 500;
  const membershipType = MembershipType.PatronFounding;
  
  const calculation = calculateTotalPayable(membershipFee, advanceDFC, membershipType);

  const handleProceedToPayment = () => {
    if (!agreedToTerms) {
      alert("Please agree to NESAm terms to proceed.");
      return;
    }
    // Navigate to payment method selection screen
    navigate("/register/payment-method");
  };

  const handleRecalculate = () => {
    // Navigate back to age details to recalculate
    navigate("/register/age-details");
  };

  const handleWhyAdvanceDFC = () => {
    // Navigate to Advance DFC explanation screen
    navigate("/register/advance-dfc");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper currentStep={4} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-6 pt-4">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-foreground mb-2">
              Final Contribution Summary
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Step 4 of 5: Contribution
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Transparent contribution structure for community support
            </p>
          </div>

          {/* Total Payable - Large Prominent Card */}
          <div className="bg-primary rounded-2xl p-8 shadow-lg">
            <p className="text-white/90 text-center mb-2">
              Total Payable Now
            </p>
            <p className="text-white text-5xl font-bold text-center">
              ₹{calculation.total.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Reassurance Message */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-5">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 flex-shrink-0">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <p className="text-foreground leading-relaxed text-center">
                This contribution activates your NESAm membership immediately.
              </p>
            </div>
          </div>

          {/* Contribution Breakup Card */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-foreground mb-4">
              Contribution Breakup
            </h2>

            <div className="flex flex-col gap-3">
              {/* Membership Fee */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Membership Fee
                </span>
                <span className="text-foreground font-medium">
                  ₹{calculation.membershipFee.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Discount Applied */}
              {calculation.discount > 0 && (
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Discount Applied
                  </span>
                  <span className="text-success font-medium">
                    – ₹{calculation.discount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Membership After Discount */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-foreground font-medium">
                  Membership Fee (After Discount)
                </span>
                <span className="text-foreground font-semibold">
                  ₹{calculation.membershipAfterDiscount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Advance DFC Contribution */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-foreground">
                    Advance DFC Contribution
                  </span>
                  <span className="text-xs text-muted-foreground">(Refundable)</span>
                </div>
                <span className="text-foreground font-semibold">
                  ₹{calculation.advanceDFC.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Total Payable */}
              <div className="flex items-center justify-between bg-primary/5 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                <span className="text-foreground font-bold">
                  Total Payable
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{calculation.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Badge - Advance DFC Info */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground leading-relaxed">
                {ADVANCE_DFC_EXPLANATION}
              </p>
            </div>
          </div>

          {/* Expandable Refund Policy */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setIsRefundPolicyExpanded(!isRefundPolicyExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
            >
              <span className="text-foreground font-medium">
                View Refund Policy
              </span>
              {isRefundPolicyExpanded ? (
                <ChevronUp className="size-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-5 text-muted-foreground" />
              )}
            </button>
            
            {isRefundPolicyExpanded && (
              <div className="px-4 pb-4 border-t border-border pt-4">
                <div className="bg-accent rounded-lg p-4">
                  <h3 className="text-foreground font-medium mb-3">
                    Refund Policy
                  </h3>
                  <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
                    <p>
                      The Advance DFC contribution (₹{calculation.advanceDFC.toLocaleString("en-IN")}) is fully refundable under the following conditions:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        If a member voluntarily exits the NESAm program
                      </li>
                      <li>
                        Upon completion of lifecycle conditions as per NESAm policy
                      </li>
                      <li>
                        After settlement of any pending community support obligations
                      </li>
                    </ul>
                    <p className="text-muted-foreground text-xs mt-2">
                      Note: The one-time membership fee (₹{calculation.membershipAfterDiscount.toLocaleString("en-IN")}) is non-refundable as it supports program operations and sustainability.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-accent rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Info className="size-5 text-primary" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                All contributions are processed securely through trusted payment gateways.
              </p>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 bg-white rounded-lg border border-border p-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm text-foreground leading-relaxed cursor-pointer"
            >
              I understand the contribution structure and agree to NESAm terms.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button 
              onClick={handleProceedToPayment} 
              className="w-full"
              disabled={!agreedToTerms}
            >
              Proceed to Payment
            </Button>

            <button
              onClick={handleRecalculate}
              className="w-full py-3 text-primary font-medium hover:underline"
            >
              Recalculate Contribution
            </button>

            <button
              onClick={handleWhyAdvanceDFC}
              className="w-full py-3 text-primary font-medium hover:underline"
            >
              Why Advance DFC?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}