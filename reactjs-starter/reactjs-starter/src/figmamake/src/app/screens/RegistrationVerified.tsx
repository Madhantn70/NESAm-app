import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";

// Helper function to mask email
const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  const visibleChars = 2;
  const masked = username.slice(0, visibleChars) + "***" + username.slice(-1);
  return `${masked}@${domain}`;
};

export default function RegistrationVerified() {
  const navigate = useNavigate();

  // Mock verified alumni data
  const alumniData = {
    name: "Rajesh Kumar",
    batch: "2015",
    department: "Computer Science & Engineering",
    email: "rajesh.kumar@example.com",
  };

  const handleContinue = () => {
    navigate("/register/contact-address");
  };

  const handleTryAnother = () => {
    // Navigate back to the start of registration to try another email
    navigate("/register/start");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="size-8 text-primary" />
            </div>
          </div>

          <h1 className="text-center text-foreground">Alumni Verified</h1>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-foreground text-lg">Is this you?</p>
          </div>

          {/* Alumni Details Card */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-foreground font-medium">
                  {alumniData.name}
                </span>
              </div>

              <div className="w-full h-px bg-border"></div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Batch</span>
                <span className="text-foreground font-medium">
                  {alumniData.batch}
                </span>
              </div>

              <div className="w-full h-px bg-border"></div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  Department
                </span>
                <span className="text-foreground font-medium">
                  {alumniData.department}
                </span>
              </div>

              <div className="w-full h-px bg-border"></div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Registered Email</span>
                <span className="text-foreground font-medium">
                  {maskEmail(alumniData.email)}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button onClick={handleContinue} className="w-full">
            Yes, Continue NESAm Registration
          </Button>

          {/* Secondary Action Button */}
          <Button
            onClick={handleTryAnother}
            variant="outline"
            className="w-full"
          >
            Not Me – Try Another Email
          </Button>
        </div>
      </main>
    </div>
  );
}