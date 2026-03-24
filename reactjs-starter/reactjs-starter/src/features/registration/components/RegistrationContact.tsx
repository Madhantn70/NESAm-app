import React from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";
import { SelectField } from "../../../components/shared/SelectField";
import { RegistrationFormData } from "../models/view/registration";

interface RegistrationContactProps {
  formData: RegistrationFormData;
  updateData: (key: keyof RegistrationFormData, value: any) => void;
  onNext: () => void;
}

export function RegistrationContact({
  formData,
  updateData,
  onNext,
}: RegistrationContactProps) {
  const isFormValid =
    formData.mobile.length === 10 &&
    formData.addressLine1.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.pinCode.length === 6;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold text-gray-900">Contact Details</h1>
        <p className="text-center text-sm text-gray-500">Step 1 of 5</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="mobile" className="text-sm font-medium text-gray-900">Mobile Number</label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-4 bg-gray-50 rounded-lg border border-gray-300">
              <span className="text-gray-900">+91</span>
            </div>
            <InputField
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit number"
              value={formData.mobile}
              onChange={(e) => updateData("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="address1" className="text-sm font-medium text-gray-900">Address Line 1</label>
          <InputField
            id="address1"
            placeholder="House/Flat No., Building Name"
            value={formData.addressLine1}
            onChange={(e) => updateData("addressLine1", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="address2" className="text-sm font-medium text-gray-900">Address Line 2 (Optional)</label>
          <InputField
            id="address2"
            placeholder="Street, Area, Locality"
            value={formData.addressLine2}
            onChange={(e) => updateData("addressLine2", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="city" className="text-sm font-medium text-gray-900">City</label>
            <InputField
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) => updateData("city", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="state" className="text-sm font-medium text-gray-900">State</label>
            <InputField
              id="state"
              placeholder="State"
              value={formData.state}
              onChange={(e) => updateData("state", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="pincode" className="text-sm font-medium text-gray-900">PIN Code</label>
            <InputField
              id="pincode"
              type="text"
              placeholder="6-digit PIN"
              value={formData.pinCode}
              onChange={(e) => updateData("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="country" className="text-sm font-medium text-gray-900">Country</label>
            <SelectField
              id="country"
              value={formData.country}
              onChange={(e) => updateData("country", e.target.value)}
              options={[{label: "India", value: "India"}]}
            />
          </div>
        </div>

        <Button onClick={onNext} disabled={!isFormValid}>Next Step</Button>
      </div>
    </div>
  );
}
