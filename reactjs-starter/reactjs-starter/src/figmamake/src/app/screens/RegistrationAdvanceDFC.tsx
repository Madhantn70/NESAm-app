import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { Button } from "../components/ui/button";
import { ShieldCheck, CheckCircle } from "lucide-react";

export default function RegistrationAdvanceDFC() {
  const navigate = useNavigate();

  const handleBackToSummary = () => {
    navigate("/register/final-summary");
  };

  const handleViewPolicy = () => {
    // Placeholder - could open a modal or navigate to policy page
    alert("DFC Policy details would be shown here");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Progress Stepper */}
      <ProgressStepper currentStep={4} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-6">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-foreground mb-2">
              Advance Community Contribution
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Step 4 of 5: Contribution
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Supporting families without delay
            </p>
          </div>

          {/* Main Explanation Card */}
          <div className="bg-accent rounded-xl border border-border p-6 shadow-sm">
            {/* What is Advance DFC */}
            <div className="mb-6">
              <h2 className="text-foreground mb-3">
                What is Advance DFC?
              </h2>
              <p className="text-foreground text-sm leading-relaxed">
                NESAm collects a small advance contribution at the time of joining. This allows the community to provide immediate financial support to bereaved families without waiting for collections.
              </p>
            </div>

            {/* Visual Concept Section */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className="flex-1 bg-primary/10 border border-primary/30 rounded-lg py-3 px-2 text-center"
                  >
                    <span className="text-xs font-medium text-primary">
                      DFC {num}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Advance contribution equals multiple future DFC events.
              </p>
            </div>

            {/* Refundability Section */}
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 flex-shrink-0">
                  <ShieldCheck className="size-6 text-green-600" />
                </div>
                <h2 className="text-foreground">
                  Is this refundable?
                </h2>
              </div>
              <p className="text-sm text-foreground leading-relaxed ml-9">
                Yes. The Advance DFC amount is refundable as per NESAm policy if a member exits the program or completes lifecycle conditions.
              </p>
            </div>

            {/* Why This Matters */}
            <div>
              <h2 className="text-foreground mb-3">
                Why this matters
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <CheckCircle className="size-5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Families receive support quickly
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <CheckCircle className="size-5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Members avoid frequent urgent payments
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <CheckCircle className="size-5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Community fund stability improves
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button onClick={handleBackToSummary} className="w-full">
              Back to Summary
            </Button>

            <button
              onClick={handleViewPolicy}
              className="w-full py-3 text-primary font-medium hover:underline"
            >
              View DFC Policy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}