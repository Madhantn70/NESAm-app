import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { Button } from "../components/ui/button";
import { Info, Award } from "lucide-react";
import { 
  MembershipType, 
  calculateTotalPayable, 
  getDiscountLabel,
  getDiscountPercent,
  ADVANCE_DFC_EXPLANATION 
} from "../utils/contributionCalculator";

interface MembershipStatus {
  isPatron: boolean;
  isFounding: boolean;
}

export default function RegistrationMembershipBenefit() {
  const navigate = useNavigate();
  
  // Mock data - in real app, this would come from user's verified alumni association status
  const [membershipStatus] = useState<MembershipStatus>({
    isPatron: true,
    isFounding: true, // User joined within 6 months of launch
  });
  
  // Mock data - would come from previous screen (age-based calculation)
  // Using 36-40 years slab as example
  const [membershipFee] = useState(7000);
  const [advanceDFC] = useState(2500);
  
  // Determine membership type based on status
  const getMembershipType = (): MembershipType => {
    if (membershipStatus.isPatron && membershipStatus.isFounding) {
      return MembershipType.PatronFounding;
    } else if (membershipStatus.isFounding) {
      return MembershipType.Founding;
    } else if (membershipStatus.isPatron) {
      return MembershipType.Patron;
    }
    return MembershipType.Regular;
  };

  const membershipType = getMembershipType();
  const discountPercent = getDiscountPercent(membershipType);
  const calculation = calculateTotalPayable(membershipFee, advanceDFC, membershipType);

  // Determine badge and description based on membership status
  const getMembershipInfo = () => {
    if (membershipStatus.isPatron && membershipStatus.isFounding) {
      return {
        badge: "Founding Patron Member",
        description: "You are among the founding supporters of the Alumni Association and a Patron Member. You receive 15% discount on the membership fee.",
      };
    } else if (membershipStatus.isFounding) {
      return {
        badge: "Founding Member",
        description: "You are among the founding supporters who joined within 6 months of launch. You receive 10% discount on the membership fee.",
      };
    } else if (membershipStatus.isPatron) {
      return {
        badge: "Patron Member",
        description: "As a Patron Member, you receive 5% discount on the membership fee.",
      };
    }
    return {
      badge: "Life Member",
      description: "You are eligible to join NESAm. Consider becoming a Patron Member for additional benefits.",
    };
  };

  const membershipInfo = getMembershipInfo();

  const handleContinue = () => {
    navigate("/register/final-summary");
  };

  const handleViewBenefitDetails = () => {
    // Placeholder - could open a modal or navigate to details page
    alert("Benefit details would be shown here");
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
              Membership Benefit Applied
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Step 4 of 5: Contribution
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your Alumni Association membership gives you special contribution benefits.
            </p>
          </div>

          {/* Main Benefit Card */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 shadow-sm">
            {/* Membership Status Section */}
            <div className="mb-6">
              <h2 className="text-foreground mb-4">
                Your Membership Status
              </h2>
              
              {/* Membership Badge */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="size-5 text-primary" />
                </div>
                <div>
                  <div className="inline-block px-4 py-2 rounded-full bg-primary text-white font-medium mb-2">
                    {membershipInfo.badge}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    {membershipInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Contribution Adjustment Section */}
            <div>
              <h2 className="text-foreground mb-4">
                Contribution Adjustment
              </h2>

              <div className="flex flex-col gap-3">
                {/* Base Contribution */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Base NESAm Membership Contribution
                  </span>
                  <span className="text-foreground font-medium">
                    ₹{membershipFee.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Membership Benefit Discount
                  </span>
                  <span className="text-green-600 font-medium">
                    – ₹{calculation.discount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-primary/20 my-2"></div>

                {/* Final Amount */}
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-primary/20">
                  <span className="text-foreground font-medium">
                    Adjusted Membership Fee
                  </span>
                  <span className="text-xl font-semibold text-primary">
                    ₹{calculation.membershipAfterDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-accent rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Info className="size-5 text-primary" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                In addition to the membership fee, an Advance DFC of ₹{advanceDFC.toLocaleString("en-IN")} will be collected. {ADVANCE_DFC_EXPLANATION}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button onClick={handleContinue} className="w-full">
              Continue to Final Summary
            </Button>

            <button
              onClick={handleViewBenefitDetails}
              className="w-full py-3 text-primary font-medium hover:underline"
            >
              View Benefit Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}