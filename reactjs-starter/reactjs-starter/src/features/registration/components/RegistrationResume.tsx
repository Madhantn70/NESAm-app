import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "../../../components/shared/Button";

interface RegistrationResumeProps {
  onContinue: () => void;
}

export function RegistrationResume({ onContinue }: RegistrationResumeProps) {
  const handleContactSupport = () => {
    window.location.href = "mailto:nesam@irttalumni.org";
  };

  return (
    <div className="flex flex-col gap-8 pt-8 animate-in fade-in duration-300 w-full">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="size-8 text-green-600" />
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold text-gray-900">
        Resume NESAm Membership
      </h1>

      <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">Status</span>
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium text-xs text-center leading-tight">
            Life/Patron Membership Verified
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <p className="text-gray-700 text-center leading-relaxed">
          Your association membership is now confirmed.
        </p>
        <p className="text-gray-700 text-center leading-relaxed mt-4">
          You can now continue NESAm membership enrollment.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onContinue} className="w-full">
          Continue Registration
        </Button>
        <Button onClick={handleContactSupport} variant="outline" className="w-full">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
