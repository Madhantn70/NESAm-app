import { useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (email.includes("@") && email.includes(".")) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = () => {
    // Placeholder for OTP verification logic
    console.log("Verifying OTP:", otp);
    navigate("/dashboard");
  };

  const handleResendOTP = () => {
    // Placeholder for resend OTP logic
    setOtp("");
    console.log("Resending OTP");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        {step === "email" ? (
          <div className="flex flex-col gap-8 pt-8">
            <h1 className="text-center text-foreground">Login to NESAm</h1>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Use the email registered with your Alumni Association.
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={!email.includes("@") || !email.includes(".")}
                className="w-full"
              >
                Send OTP
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pt-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-center text-foreground">Enter OTP</h1>
              <p className="text-center text-muted-foreground">
                Sent to {email}
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 items-center">
                <label htmlFor="otp" className="text-foreground">
                  6-Digit OTP
                </label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="w-full"
                >
                  Verify OTP
                </Button>
                
                <Button
                  onClick={handleResendOTP}
                  variant="outline"
                  className="w-full"
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to NESAm terms
          </p>
        </div>
      </main>
    </div>
  );
}