import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { ShieldCheck, CheckCircle, Lock } from "lucide-react";

export default function RegistrationPaymentMethod() {
  const navigate = useNavigate();

  // Mock data - in real app, this would come from previous screens
  // Using the same example as Final Summary screen
  const totalPayable = 8450; // Example: 36-40 years slab with Patron + Founding discount

  const handleOnlinePayment = () => {
    // Navigate to payment processing screen
    navigate("/register/payment-processing");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Progress Stepper */}
      <ProgressStepper currentStep={5} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-6">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-foreground mb-2">
              Complete Your Contribution
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Step 5 of 5: Payment
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Secure online payment for instant NESAm membership activation.
            </p>
          </div>

          {/* Prominent Payable Amount */}
          <div className="bg-primary/5 rounded-2xl border-2 border-primary/30 p-6">
            <p className="text-center text-foreground leading-relaxed mb-1">
              Pay <span className="text-3xl font-bold text-primary">₹{totalPayable.toLocaleString("en-IN")}</span> to activate NESAm membership
            </p>
          </div>

          {/* Single Payment Card - Online Only */}
          <div className="bg-white rounded-xl border-2 border-primary/30 p-8 shadow-lg">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="size-8 text-primary" />
              </div>
              <h2 className="text-foreground text-center">
                Pay Online
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground leading-relaxed text-center mb-6">
              Use UPI, Netbanking, Debit/Credit Card, or Wallet for instant confirmation.
            </p>

            {/* Benefits List */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Instant membership activation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Fully secure payment gateway
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Digital receipt generated automatically
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleOnlinePayment}
              className="w-full bg-primary text-white py-4 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
            >
              Proceed to Secure Payment
            </button>
          </div>

          {/* Trust Banner */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Lock className="size-5 text-green-700" />
              </div>
              <p className="text-sm text-foreground leading-relaxed text-center">
                All payments are processed through a certified payment gateway.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}