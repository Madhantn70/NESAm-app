import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Users, Heart, Calendar, IndianRupee } from "lucide-react";

export default function GuestPublicImpact() {
  const navigate = useNavigate();

  const handleJoinNESAm = () => {
    navigate("/register/enter-email");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleHowItWorks = () => {
    // Navigate to how it works screen (placeholder for now)
    alert("How NESAm Works screen will be shown here");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />

      <main className="w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-foreground mb-4">
            Community Support.
            <br />
            Built on Trust.
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-6">
            NESAm is an alumni family support initiative where members contribute together to help families during difficult times. A transparent, dignified approach to community welfare.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={handleJoinNESAm}
          >
            Join NESAm
          </Button>
        </section>

        {/* Impact Snapshot Section */}
        <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-foreground mb-5 text-center">
            Community Impact
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Total Members */}
            <div className="bg-accent rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="size-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                425
              </div>
              <div className="text-sm text-muted-foreground">
                Total Members
              </div>
            </div>

            {/* Families Supported */}
            <div className="bg-accent rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="size-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                48
              </div>
              <div className="text-sm text-muted-foreground">
                Families Supported
              </div>
            </div>

            {/* DFC Events Conducted */}
            <div className="bg-accent rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                48
              </div>
              <div className="text-sm text-muted-foreground">
                DFC Events Conducted
              </div>
            </div>

            {/* Total Community Support */}
            <div className="bg-accent rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="size-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                ₹72L
              </div>
              <div className="text-sm text-muted-foreground">
                Community Support
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Actions Section */}
        <section className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleHowItWorks}
          >
            How NESAm Works
          </Button>

          <button
            onClick={handleLogin}
            className="w-full py-3 text-primary font-medium hover:underline"
          >
            Already a Member? Login
          </button>
        </section>

        {/* Footer */}
        <section className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            An Initiative of IRTT Alumni Association
          </p>
        </section>
      </main>
    </div>
  );
}
