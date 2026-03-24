import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Info, CheckCircle } from "lucide-react";
import { getAgeBandSlab, ADVANCE_DFC_EXPLANATION } from "../utils/contributionCalculator";

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function RegistrationAgeDetails() {
  const navigate = useNavigate();
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Calculate age and contribution details when date of birth is set
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const contributionDetails = age !== null ? getAgeBandSlab(age) : null;

  const handleNext = () => {
    if (dateOfBirth) {
      navigate("/register/nominee-details");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper currentStep={2} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-foreground">Age Details</h1>
            <p className="text-center text-sm text-muted-foreground">
              Step 2 of 5
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Date of Birth */}
            <div className="flex flex-col gap-3">
              <label htmlFor="dob" className="text-foreground">
                Date of Birth
              </label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Information Note */}
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 flex gap-4">
              <Info className="size-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed">
                Your contribution slab depends on your age.
              </p>
            </div>

            {/* Dynamic Contribution Details - shown after DOB selection */}
            {contributionDetails && (
              <div className="bg-white rounded-xl border-2 border-primary/20 p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="size-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground">
                      Your Contribution Details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Based on your age: {age} years
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Detected Age Band - Prominent */}
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">
                        Detected Age Band
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {contributionDetails.label}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  {/* Membership Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Membership Fee
                    </span>
                    <span className="text-foreground font-semibold">
                      ₹{contributionDetails.membershipFee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* DFC Per Event */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      DFC per Event
                    </span>
                    <span className="text-foreground font-semibold">
                      ₹{contributionDetails.dfcPerEvent.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Advance DFC */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">
                        Advance DFC
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (5 × ₹{contributionDetails.dfcPerEvent.toLocaleString("en-IN")})
                      </span>
                    </div>
                    <span className="text-foreground font-semibold">
                      ₹{contributionDetails.advanceDFC.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Total at Joining - Prominent */}
                  <div className="bg-primary rounded-lg px-6 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">
                        Total at Joining
                      </span>
                      <span className="text-2xl font-bold text-white">
                        ₹{contributionDetails.totalAtJoining.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advance DFC Explanation */}
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">
                    {ADVANCE_DFC_EXPLANATION}
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Discounts (if applicable) will be shown in the next steps.
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={!dateOfBirth}
              className="w-full"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}