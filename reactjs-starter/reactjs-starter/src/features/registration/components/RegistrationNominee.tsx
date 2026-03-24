import React from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";
import { SelectField } from "../../../components/shared/SelectField";
import { RegistrationFormData } from "../models/view/registration";

interface RegistrationNomineeProps {
  formData: RegistrationFormData;
  updateData: (key: keyof RegistrationFormData, value: any) => void;
  onNext: () => void;
}

const relationshipOptions = [
  { label: "Select relationship", value: "" },
  { label: "Spouse", value: "Spouse" },
  { label: "Son", value: "Son" },
  { label: "Daughter", value: "Daughter" },
  { label: "Father", value: "Father" },
  { label: "Mother", value: "Mother" },
  { label: "Brother", value: "Brother" },
  { label: "Sister", value: "Sister" },
  { label: "Other", value: "Other" },
];

export function RegistrationNominee({
  formData,
  updateData,
  onNext,
}: RegistrationNomineeProps) {
  const isFormValid =
    formData.nomineeName.trim() !== "" &&
    formData.relationship.trim() !== "" &&
    formData.nomineeMobile.length === 10;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold text-gray-900">Nominee Details</h1>
        <p className="text-center text-sm text-gray-500">Step 3 of 5</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="nomineeName" className="text-sm font-medium text-gray-900">Nominee Name</label>
          <InputField
            id="nomineeName"
            placeholder="Enter full name"
            value={formData.nomineeName}
            onChange={(e) => updateData("nomineeName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="relationship" className="text-sm font-medium text-gray-900">Relationship</label>
          <SelectField
            id="relationship"
            value={formData.relationship}
            onChange={(e) => updateData("relationship", e.target.value)}
            options={relationshipOptions}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="nomineeMobile" className="text-sm font-medium text-gray-900">Nominee Mobile</label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-4 bg-gray-50 rounded-lg border border-gray-300">
              <span className="text-gray-900">+91</span>
            </div>
            <InputField
              id="nomineeMobile"
              type="tel"
              placeholder="Enter 10-digit number"
              value={formData.nomineeMobile}
              onChange={(e) => updateData("nomineeMobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="nomineeEmail" className="text-sm font-medium text-gray-900">Nominee Email (Optional)</label>
          <InputField
            id="nomineeEmail"
            type="email"
            placeholder="Enter email"
            value={formData.nomineeEmail}
            onChange={(e) => updateData("nomineeEmail", e.target.value)}
          />
        </div>

        <Button onClick={onNext} disabled={!isFormValid}>Next Step</Button>
      </div>
    </div>
  );
}
