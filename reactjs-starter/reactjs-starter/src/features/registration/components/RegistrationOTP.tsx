import React from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";
import { Key } from "lucide-react";

interface RegistrationOTPProps {
  email: string;
  otp: string;
  updateOtp: (val: string) => void;
  onVerify: (otp: string) => void;
  loading: boolean;
  error: string | null;
}

export function RegistrationOTP({
  email,
  otp,
  updateOtp,
  onVerify,
  loading,
  error,
}: RegistrationOTPProps) {
  return (
    <div className="flex flex-col gap-8 pt-8 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Enter Authentication Token</h1>
        <p className="text-xs text-gray-500 mt-2 text-center">
          A secure token has been generated. Please enter the UUID token displayed in the backend console.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="otp" className="text-sm font-medium text-gray-700">
            Authentication Token (UUID)
          </label>
          <InputField
            id="otp"
            type="text"
            placeholder="Paste token here"
            value={otp}
            onChange={(e) => updateOtp(e.target.value)}
            disabled={loading}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-[10px] text-gray-400">
            This token is one-time use and expires shortly.
          </p>
        </div>

        <Button
          onClick={() => onVerify(otp)}
          disabled={!otp || loading}
          className="w-full"
        >
          {loading ? "Authenticating..." : "Establish Secure Session"}
        </Button>
      </div>
    </div>
  );
}
