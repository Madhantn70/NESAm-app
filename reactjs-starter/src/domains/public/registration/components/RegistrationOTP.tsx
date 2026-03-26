import React from "react";
import { Button } from "@/shared/components/shared/Button";
import { OTPInput } from "@/shared/components/shared/OTPInput";

interface RegistrationOTPProps {
  email: string;
  otp: string;
  updateOtp: (val: string) => void;
  onVerify: () => void;
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
    <div className="flex flex-col gap-8 pt-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-900">Enter OTP</h1>
        <p className="text-xs text-gray-500 mt-2">Sent to {email}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 items-center">
          <label htmlFor="otp" className="text-sm font-medium text-gray-900 self-start">
            6-Digit OTP (Mock pass: 123456)
          </label>
          <OTPInput
            value={otp}
            onChange={updateOtp}
            maxLength={6}
          />
          {error && <p className="text-xs text-red-500 self-start">{error}</p>}
        </div>

        <Button
          onClick={onVerify}
          disabled={otp.length !== 6 || loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
