import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

export default function RegistrationMembershipPending() {
  const navigate = useNavigate();

  const handlePayMembership = () => {
    // Placeholder for payment flow
    window.open("https://alumni-association-payment.example", "_blank");
  };

  const handleAlreadyPaid = () => {
    // Placeholder - could trigger manual verification request
    navigate("/register/verified");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="size-8 text-destructive" />
            </div>
          </div>

          <h1 className="text-center text-foreground">
            Association Membership Required
          </h1>

          <div className="bg-accent rounded-xl border border-border p-6">
            <p className="text-foreground text-center leading-relaxed">
              You are an alumni but not yet a Life/Patron Member.
            </p>
            <p className="text-foreground text-center leading-relaxed mt-4">
              Please complete the Life/Patron Membership before joining NESAm.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Membership Status</span>
              <span className="px-4 py-2 rounded-full bg-destructive/10 text-destructive font-medium">
                Pending
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handlePayMembership}
              className="w-full"
            >
              Pay Life/Patron Membership
            </Button>

            <Button
              onClick={handleAlreadyPaid}
              variant="outline"
              className="w-full"
            >
              I have already paid
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}