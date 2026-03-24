import React from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";

interface RegistrationEnterEmailProps {
  email: string;
  updateEmail: (val: string) => void;
  onVerify: () => void;
  loading: boolean;
  error: string | null;
}

export function RegistrationEnterEmail({
  email,
  updateEmail,
  onVerify,
  loading,
  error,
}: RegistrationEnterEmailProps) {
  return (
    <div className="flex flex-col gap-8 pt-8">
      <h1 className="text-center text-xl font-semibold text-gray-900">Join NESAm</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email Address
          </label>
          <InputField
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            We will verify your alumni membership. (Hint: 'notfound' or 'pending' trigger mocks)
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <Button
          onClick={onVerify}
          disabled={!email.includes("@") || !email.includes(".") || loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to NESAm terms
        </p>
      </div>
    </div>
  );
}
