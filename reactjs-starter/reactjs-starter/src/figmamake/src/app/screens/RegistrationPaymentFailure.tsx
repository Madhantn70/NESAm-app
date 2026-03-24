import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { AlertCircle, X, Wifi, CreditCard, Clock } from "lucide-react";

export default function RegistrationPaymentFailure() {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    // Navigate back to payment method screen
    navigate("/register/payment-method");
  };

  const handleContactSupport = () => {
    alert("Contact support for assistance");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col">
        <div className="flex flex-col gap-8">
          {/* Warning Icon */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertCircle className="size-12 text-amber-600" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center">
            <h1 className="text-foreground mb-3">
              Payment Not Completed
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Your contribution could not be processed. No amount has been deducted or the transaction is incomplete.
            </p>
          </div>

          {/* Info Card - Possible Reasons */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-center">
              Possible Reasons
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <X className="size-5 text-amber-700" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Payment was cancelled
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <Wifi className="size-5 text-amber-700" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Network interruption
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <CreditCard className="size-5 text-amber-700" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Bank declined the transaction
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <Clock className="size-5 text-amber-700" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Session timeout
                </p>
              </div>
            </div>
          </div>

          {/* Reassurance Section */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <p className="text-sm text-foreground leading-relaxed text-center">
              You can safely retry the payment.
              <br /><br />
              If any amount was debited, it will be automatically refunded by your bank within standard timelines.
            </p>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Primary Button */}
            <button
              onClick={handleRetryPayment}
              className="w-full bg-primary text-white py-4 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
            >
              Retry Secure Payment
            </button>

            {/* Secondary Link */}
            <div className="text-center">
              <button
                onClick={handleContactSupport}
                className="text-sm text-primary hover:underline"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
