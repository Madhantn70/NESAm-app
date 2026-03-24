import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RegistrationResume() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate to contact & address screen to continue registration
    navigate("/register/contact-address");
  };

  const handleContactSupport = () => {
    // Placeholder - could open email or support page
    window.location.href = "mailto:support@nesam.example";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-center text-foreground">
            Resume NESAm Membership
          </h1>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Status</span>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                Life/Patron Membership Verified
              </span>
            </div>
          </div>

          {/* Message Card */}
          <div className="bg-accent rounded-xl border border-border p-6">
            <p className="text-foreground text-center leading-relaxed">
              Your association membership is now confirmed.
            </p>
            <p className="text-foreground text-center leading-relaxed mt-4">
              You can now continue NESAm membership enrollment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleContinue} className="w-full">
              Continue Registration
            </Button>

            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}