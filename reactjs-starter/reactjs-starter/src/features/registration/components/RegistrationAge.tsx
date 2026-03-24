import React, { useMemo } from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";
import { Info, CheckCircle } from "lucide-react";
import { getAgeBandSlab, ADVANCE_DFC_EXPLANATION } from "../../../utils/contributionCalculator";
import { RegistrationFormData } from "../models/view/registration";

interface RegistrationAgeProps {
  formData: RegistrationFormData;
  updateData: (key: keyof RegistrationFormData, value: any) => void;
  onNext: () => void;
}

const calculateAge = (dob: string) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export function RegistrationAge({ formData, updateData, onNext }: RegistrationAgeProps) {
  const age = useMemo(() => (formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null), [formData.dateOfBirth]);
  const contribution = useMemo(() => (age !== null ? getAgeBandSlab(age) : null), [age]);

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold text-gray-900">Age Details</h1>
        <p className="text-center text-sm text-gray-500">Step 2 of 5</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="dob" className="text-sm font-medium text-gray-900">Date of Birth</label>
          <InputField
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateData("dateOfBirth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="bg-teal-50 rounded-xl border border-teal-100 p-4 flex gap-3">
          <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-900 leading-relaxed">
            Your contribution slab depends on your age.
          </p>
        </div>

        {contribution && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-medium text-gray-900">Your Contribution Details</h2>
                <p className="text-xs text-gray-500">Based on your age: {age} years</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col gap-1">
                <span className="text-gray-500">Detected Age Band</span>
                <span className="text-lg font-semibold text-teal-600">{contribution.label}</span>
              </div>

              <div className="border-t border-gray-100" />

              <div className="flex justify-between">
                <span className="text-gray-500">Membership Fee</span>
                <span className="font-medium text-gray-900">₹{contribution.membershipFee.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">DFC per Event</span>
                <span className="font-medium text-gray-900">₹{contribution.dfcPerEvent.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-500">Advance DFC</span>
                  <span className="text-[10px] text-gray-400">(5 × ₹{contribution.dfcPerEvent.toLocaleString("en-IN")})</span>
                </div>
                <span className="font-medium text-gray-900">₹{contribution.advanceDFC.toLocaleString("en-IN")}</span>
              </div>

              <div className="bg-teal-600 rounded-lg p-4 flex justify-between items-center mt-2">
                <span className="font-medium text-white">Total at Joining</span>
                <span className="text-xl font-bold text-white">₹{contribution.totalAtJoining.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500 leading-relaxed text-balance">
                {ADVANCE_DFC_EXPLANATION}
              </p>
            </div>
          </div>
        )}

        <Button onClick={onNext} disabled={!formData.dateOfBirth}>Next Step</Button>
      </div>
    </div>
  );
}
