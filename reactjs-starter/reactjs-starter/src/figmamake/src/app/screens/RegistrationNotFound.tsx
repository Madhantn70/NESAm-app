import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

export default function RegistrationNotFound() {
  const navigate = useNavigate();

  const handleVisitAlumniWebsite = () => {
    // Placeholder for opening alumni association website
    window.open("https://alumni-association-website.example", "_blank");
  };

  const handleTryAnother = () => {
    navigate("/register/enter-email");
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
            Alumni Record Not Found
          </h1>

          <div className="bg-accent rounded-xl border border-border p-6">
            <p className="text-foreground text-center leading-relaxed">
              We could not find your details in the Alumni database.
            </p>
            <p className="text-foreground text-center leading-relaxed mt-4">
              Please register with the Alumni Association first.
            </p>
            <p className="text-muted-foreground text-center text-sm leading-relaxed mt-4">
              If you recently updated your details, please try again later or contact support.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleVisitAlumniWebsite}
              className="w-full"
            >
              Visit Alumni Website
            </Button>

            <Button
              onClick={handleTryAnother}
              variant="outline"
              className="w-full"
            >
              Try Another Email
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}