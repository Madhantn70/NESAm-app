import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function RegistrationEnterEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleVerifyEmail = () => {
    // Mock verification logic
    // This would normally check against alumni database
    if (email.includes("@")) {
      // Simulate different outcomes
      if (email.includes("notfound")) {
        navigate("/register/not-found");
      } else if (email.includes("pending")) {
        navigate("/register/membership-pending");
      } else {
        navigate("/register/verified");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-8">
          <h1 className="text-center text-foreground">Join NESAm</h1>

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
                We will verify your alumni membership.
              </p>
            </div>

            <Button
              onClick={handleVerifyEmail}
              disabled={!email.includes("@") || !email.includes(".")}
              className="w-full"
            >
              Verify Email
            </Button>
          </div>
        </div>

        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to NESAm terms
          </p>
        </div>
      </main>
    </div>
  );
}