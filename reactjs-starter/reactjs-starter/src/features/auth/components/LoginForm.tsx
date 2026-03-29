import React from "react";
import { InputField } from "../../../components/shared/InputField";
import { Button } from "../../../components/shared/Button";
import { useLoginViewModel } from "../viewModels/useLoginViewModel";
import { LoginStep } from "../../../constants/auth";

import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const { 
    mobileNumber, 
    setMobileNumber, 
    otp, 
    setOtp, 
    step, 
    loading, 
    error, 
    message,
    handleSendOTP, 
    handleVerifyOTP 
  } = useLoginViewModel();
  const navigate = useNavigate();

  const onVerify = async () => {
    const state = await handleVerifyOTP();
    if (state?.isAuthenticated) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 border border-white/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {step === LoginStep.ENTER_MOBILE ? (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500">
              Enter your mobile number to receive an OTP
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 ml-1">
                Mobile Number
              </label>
              <InputField
                id="mobile"
                type="tel"
                placeholder="e.g. 8667602881"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={loading}
                className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {error && <p className="text-sm text-red-500 animate-pulse ml-1">{error}</p>}
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={mobileNumber.length < 10 || loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transform transition-active active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : "Get OTP"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Verify OTP
            </h1>
            <p className="text-sm text-gray-500">
              Sent to <span className="font-semibold text-gray-700">{mobileNumber}</span>
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4 flex flex-col items-center">
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 self-start ml-1">
                Enter Token
              </label>
              <InputField
                id="otp"
                placeholder="Enter the token from console"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all text-center tracking-widest font-mono"
              />
              {message && <p className="text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-xl w-full text-center">{message}</p>}
              {error && <p className="text-sm text-red-500 animate-pulse self-start ml-1">{error}</p>}
            </div>

            <Button
              onClick={onVerify}
              disabled={otp.length < 4 || loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transform transition-active active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : "Login"}
            </Button>
          </div>
        </>
      )}

      <div className="pt-4 text-center">
        <p className="text-xs text-gray-400">
          By continuing, you agree to NESAm <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
