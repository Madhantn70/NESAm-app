import React, { useState } from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";
import { CheckCircle, AlertCircle, Phone } from "lucide-react";
import { AlumniViewData } from "../models/view/registration";
import { maskEmail } from "../mappers/registrationMapper";
import { useRegistrationViewModel } from "../viewModels/useRegistrationViewModel";

interface RegistrationVerifiedProps {
  alumniData: AlumniViewData | null;
  onContinue: () => void;
  onTryAnother: () => void;
}

export function RegistrationVerified({ alumniData, onContinue, onTryAnother }: RegistrationVerifiedProps) {
  const vm = useRegistrationViewModel();
  const [mobile, setMobile] = useState("");

  if (!alumniData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-12 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Session Expired</h1>
        <p className="text-gray-500 max-w-xs">
          Your verification session has expired. Redirecting you back to start...
        </p>
        <Button onClick={onTryAnother} variant="outline" className="mt-4">
          Verify Again Now
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-8 w-full">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-teal-600" />
        </div>
      </div>

      <h1 className="text-center text-xl font-semibold text-gray-900">Alumni Verified</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <DetailItem label="Name" value={alumniData?.name ?? "-"} />
          <div className="w-full h-px bg-gray-200"></div>
          <DetailItem label="Batch" value={alumniData?.batch ?? "-"} />
          <div className="w-full h-px bg-gray-200"></div>
          <DetailItem label="Department" value={alumniData?.department ?? "-"} />
          <div className="w-full h-px bg-gray-200"></div>
          <DetailItem label="Registered Email" value={alumniData ? maskEmail(alumniData.email) : "-"} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="mobile" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Confirm Mobile Number for OTP
          </label>
          <InputField
            id="mobile"
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <p className="text-[10px] text-gray-400">We'll send a secure token to this number.</p>
        </div>

        <Button 
          onClick={() => vm.handleRequestOtp(mobile)}
          disabled={mobile.length < 10 || vm.loading}
        >
          {vm.loading ? "Sending..." : "Yes, Send OTP Token"}
        </Button>
        <Button onClick={onTryAnother} variant="outline">
          Not Me – Try Another Email
        </Button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}
