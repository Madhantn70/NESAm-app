import { useState } from "react";
import { LoginStep } from "../../../constants/auth";
import { requestToken, loginWithToken } from "../../../services/auth";

export const useLoginViewModel = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<LoginStep>(LoginStep.ENTER_MOBILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (mobileNumber.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await requestToken(mobileNumber);
      setStep(LoginStep.ENTER_OTP);
      setMessage("OTP generated! Check backend console.");
    } catch (err: any) {
      setError(err || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      setError("Please enter the token");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const jwt = await loginWithToken(otp);
      localStorage.setItem("token", jwt);
      return { isAuthenticated: true };
    } catch (err: any) {
      setError(err || "Invalid or expired token");
      return { isAuthenticated: false };
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    await handleSendOTP();
  };

  return {
    mobileNumber,
    setMobileNumber,
    otp,
    setOtp,
    step,
    loading,
    error,
    message,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
  };
};
