import React from "react";
import { InputField } from "@/shared/components/shared/InputField";
import { Button } from "@/shared/components/shared/Button";
import { useLoginViewModel } from "@/domains/public/login/viewModels/useLoginViewModel";
import { LoginStep } from "@/shared/constants/auth";
import { OTPInput } from "@/shared/components/shared/OTPInput";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const { email, setEmail, otp, setOtp, step, loading, error, handleSendOTP, handleVerifyOTP } = useLoginViewModel();
  const navigate = useNavigate();

  const onVerify = async () => {
    const state = await handleVerifyOTP();
    if (state?.isAuthenticated) {
      navigate("/member");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-5">
      {step === LoginStep.ENTER_EMAIL ? (
        <>
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Login to NESAm
          </h1>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <InputField
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Use the email registered with your Alumni Association.
              </p>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={!email.includes("@") || !email.includes(".") || loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Enter OTP
          </h1>
          <p className="text-xs text-gray-500 text-center">
            Sent to {email}
          </p>
          
          <div className="space-y-5">
            <div className="space-y-2 flex flex-col items-center">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-900 self-start">
                6-Digit OTP
              </label>
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
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
        </>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        By continuing, you agree to NESAm terms
      </p>
    </div>
  );
}
