import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ShieldCheck } from "lucide-react";

export default function RegistrationPaymentProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate payment processing (in real app, this would check actual payment status)
    const timer = setTimeout(() => {
      // Navigate to payment success screen after processing
      navigate("/register/payment-success");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNeedHelp = () => {
    alert("Contact support for assistance");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-8 w-full">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-foreground mb-2">
              Processing Your Contribution
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Please wait while we confirm your payment
            </p>
          </div>

          {/* Animated Loader */}
          <div className="flex flex-col items-center gap-6">
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Status Text */}
            <p className="text-sm text-foreground font-medium text-center">
              Connecting to secure payment gateway…
            </p>
          </div>

          {/* Trust Reassurance Card */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="size-6 text-green-600" />
              </div>

              {/* Heading */}
              <h2 className="text-foreground text-center">
                Secure Transaction
              </h2>

              {/* Supporting Text */}
              <p className="text-sm text-foreground leading-relaxed text-center">
                Your payment is being processed through a certified and encrypted payment gateway.{" "}
                <span className="font-medium">Please do not close this screen or press back.</span>
              </p>

              {/* Micro Text */}
              <p className="text-xs text-muted-foreground text-center">
                This usually takes a few seconds.
              </p>
            </div>
          </div>

          {/* Need Help Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleNeedHelp}
              className="text-sm text-primary hover:underline"
            >
              Need Help?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}