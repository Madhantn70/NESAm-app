import React from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/shared/Button";

interface MemberImpactCardProps {
  familiesSupported: number;
}

export function MemberImpactCard({ familiesSupported }: MemberImpactCardProps) {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/30 p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-lg font-semibold">Community Impact</h2>
          <p className="text-foreground leading-relaxed text-sm">
            Your contributions helped support <span className="font-semibold text-primary">{familiesSupported} families</span>.
          </p>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate("/member/impact")}
        className="w-full"
      >
        Explore Community Impact
      </Button>
    </section>
  );
}
