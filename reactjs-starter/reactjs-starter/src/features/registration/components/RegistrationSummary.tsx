import React, { useState } from "react";
import { Button } from "../../../components/shared/Button";
import { CheckboxField } from "../../../components/shared/CheckboxField";
import { CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { calculateTotalPayable, getAgeBandSlab, ADVANCE_DFC_EXPLANATION } from "../../../utils/contributionCalculator";
import { RegistrationFormData, RegistrationStep } from "../models/view/registration";

interface RegistrationSummaryProps {
  formData: RegistrationFormData;
  onSubmit: () => void;
  onGoBackToAge: () => void;
  loading: boolean;
  error: string | null;
}

export function RegistrationSummary({
  formData,
  onSubmit,
  onGoBackToAge,
  loading,
  error,
}: RegistrationSummaryProps) {
  const [agreed, setAgreed] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  // Derive age band from DOB locally to run standard calculations
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const ageData = formData.dateOfBirth ? getAgeBandSlab(calculateAge(formData.dateOfBirth)) : null;

  if (!ageData) {
    return (
      <div className="flex flex-col pt-8 items-center gap-4">
        <p className="text-gray-500 text-sm">Missing Age Information</p>
        <Button onClick={onGoBackToAge} className="w-auto px-8">Return to Step 2</Button>
      </div>
    );
  }

  const calc = calculateTotalPayable(ageData.membershipFee, ageData.advanceDFC, formData.membershipType);

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Final Contribution Summary</h1>
        <p className="text-sm text-gray-500">Step 4 of 5: Contribution</p>
      </div>

      <div className="bg-teal-600 rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <p className="text-teal-50 text-sm mb-1">Total Payable Now</p>
        <p className="text-white text-4xl font-bold">₹{calc.total.toLocaleString("en-IN")}</p>
      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-4 flex gap-3 items-center">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800">This contribution activates your NESAm membership immediately.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Contribution Breakup</h2>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500">Membership Fee</span>
            <span className="font-medium text-gray-900">₹{calc.membershipFee.toLocaleString("en-IN")}</span>
          </div>
          {calc.discount > 0 && (
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500">Discount Applied</span>
              <span className="font-medium text-green-600">– ₹{calc.discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="font-medium text-gray-900">Membership Fee (After Discount)</span>
            <span className="font-medium text-gray-900">₹{calc.membershipAfterDiscount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-900">Advance DFC Contribution</span>
              <span className="text-[10px] text-gray-500">(Refundable)</span>
            </div>
            <span className="font-medium text-gray-900">₹{calc.advanceDFC.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between bg-gray-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl border-t border-gray-200">
            <span className="font-bold text-gray-900">Total Payable</span>
            <span className="font-bold text-teal-600 text-lg">₹{calc.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setPolicyOpen(!policyOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-900">View Refund Policy</span>
          {policyOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {policyOpen && (
          <div className="px-4 pb-4 border-t border-gray-200 pt-4 bg-gray-50 text-xs text-gray-600">
            <p className="mb-2">The Advance DFC contribution (₹{calc.advanceDFC.toLocaleString("en-IN")}) is fully refundable under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>If a member voluntarily exits the NESAm program</li>
              <li>Upon completion of lifecycle conditions as per policy</li>
              <li>After settlement of any pending community support obligations</li>
            </ul>
            <p className="text-gray-400 italic">Note: The one-time membership fee is non-refundable.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <Info className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <p className="text-xs text-gray-600 flex-1">All contributions are processed securely through trusted gateways.</p>
      </div>

      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <CheckboxField
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          label="I understand the contribution structure and agree to NESAm terms."
        />
      </div>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <div className="flex flex-col gap-3">
        <Button onClick={onSubmit} disabled={!agreed || loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
        <button onClick={onGoBackToAge} className="text-sm text-teal-600 hover:underline py-2">
          Recalculate Contribution
        </button>
      </div>
    </div>
  );
}
