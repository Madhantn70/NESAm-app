import { useState } from "react";
import { LoginStep } from "@/shared/constants/auth";
import { authApi } from "@/core/api/authApi";
import { mapAuthResponseToViewState } from "@/shared/utils/mappers/authMapper";
import { AuthView } from "@/domains/public/login/models/view/auth";

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<LoginStep>(LoginStep.ENTER_EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authApi.login({ email });
      setStep(LoginStep.ENTER_OTP);
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (): Promise<AuthView | null> => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp({ email, otp });
      const viewState = mapAuthResponseToViewState(response);
      return viewState;
    } catch (err: any) {
      setError(err?.message || "Failed to verify OTP");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    await handleSendOTP();
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    step,
    loading,
    error,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
  };
};
