import React from "react";
import { Award, Info } from "lucide-react";
import { Button } from "@/shared/components/shared/Button";
import { MembershipType, calculateTotalPayable, ADVANCE_DFC_EXPLANATION } from "@/shared/utils/contributionCalculator";

interface RegistrationMembershipBenefitProps {
  membershipType: MembershipType;
  membershipFee: number;
  advanceDFC: number;
  onContinue: () => void;
}

export function RegistrationMembershipBenefit({ 
  membershipType,
  membershipFee,
  advanceDFC,
  onContinue
}: RegistrationMembershipBenefitProps) {

  const calculation = calculateTotalPayable(membershipFee, advanceDFC, membershipType);

  const getMembershipInfo = () => {
    switch(membershipType) {
      case MembershipType.PatronFounding:
        return {
          badge: "Founding Patron Member",
          description: "You are among the founding supporters of the Alumni Association and a Patron Member. You receive 15% discount on the membership fee.",
        };
      case MembershipType.Founding:
        return {
          badge: "Founding Member",
          description: "You are among the founding supporters who joined within 6 months of launch. You receive 10% discount on the membership fee.",
        };
      case MembershipType.Patron:
        return {
          badge: "Patron Member",
          description: "As a Patron Member, you receive 5% discount on the membership fee.",
        };
      default:
        return {
          badge: "Life Member",
          description: "You are eligible to join NESAm. Consider becoming a Patron Member for additional benefits.",
        };
    }
  };

  const membershipInfo = getMembershipInfo();

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Membership Benefit Applied
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          Step 4 of 5: Contribution
        </p>
        <p className="text-gray-600 leading-relaxed">
          Your Alumni Association membership gives you special contribution benefits.
        </p>
      </div>

      <div className="bg-teal-50/50 rounded-xl border border-teal-100 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-gray-900 font-semibold mb-4">
            Your Membership Status
          </h2>
          
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Award className="size-5 text-teal-600" />
            </div>
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-teal-600 text-white font-medium text-sm mb-2">
                {membershipInfo.badge}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {membershipInfo.description}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-gray-900 font-semibold mb-4">
            Contribution Adjustment
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Base NESAm Membership Contribution
              </span>
              <span className="text-gray-900 font-medium">
                ₹{membershipFee.toLocaleString("en-IN")}
              </span>
            </div>

            {calculation.discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Membership Benefit Discount
                </span>
                <span className="text-green-600 font-medium">
                  – ₹{calculation.discount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="border-t border-teal-200/50 my-2"></div>

            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-teal-100">
              <span className="text-gray-900 font-medium">
                Adjusted Membership Fee
              </span>
              <span className="text-xl font-bold text-teal-600">
                ₹{calculation.membershipAfterDiscount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 flex-shrink-0 mt-0.5">
            <Info className="size-5 text-teal-600" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            In addition to the membership fee, an Advance DFC of ₹{advanceDFC.toLocaleString("en-IN")} will be collected. {ADVANCE_DFC_EXPLANATION}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={onContinue} className="w-full">
          Continue to Final Summary
        </Button>
      </div>
    </div>
  );
}
