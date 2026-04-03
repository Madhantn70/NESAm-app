import React from "react";
import { Button } from "../../../components/shared/Button";
import { InputField } from "../../../components/shared/InputField";

interface RegistrationEnterEmailProps {
  email: string;
  updateEmail: (val: string) => void;
  onVerify: (email: string) => void;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && email.includes("@") && email.includes(".")) {
      console.log("Submitting verification for email:", email);
      onVerify(email);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-8 w-full max-w-sm">
      <h1 className="text-center text-xl font-semibold text-gray-900">Join NESAm</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            aria-label="Enter your email address to join NESAm"
            required
          />
          {error && (
            <p className="text-xs text-red-500 font-medium" role="alert">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!email.includes("@") || !email.includes(".") || loading}
          aria-busy={loading}
          className="relative transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to NESAm terms
        </p>
      </div>
    </div>
  );
}
