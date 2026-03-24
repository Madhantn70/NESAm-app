import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../components/shared/Button";

interface RegistrationMembershipPendingProps {
  onAlreadyPaid: () => void;
}

export function RegistrationMembershipPending({ onAlreadyPaid }: RegistrationMembershipPendingProps) {
  const handlePayMembership = () => {
    window.open("https://irttalumni.org", "_blank");
  };

  return (
    <div className="flex flex-col gap-8 pt-8 animate-in fade-in duration-300 w-full">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="size-8 text-red-600" />
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold text-gray-900">
        Association Membership Required
      </h1>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <p className="text-gray-700 text-center leading-relaxed">
          You are an alumni but not yet a Life/Patron Member.
        </p>
        <p className="text-gray-700 text-center leading-relaxed mt-4">
          Please complete the Life/Patron Membership before joining NESAm.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">Membership Status</span>
          <span className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium text-sm">
            Pending
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handlePayMembership} className="w-full">
          Pay Life/Patron Membership
        </Button>
        <Button onClick={onAlreadyPaid} variant="outline" className="w-full">
          I have already paid
        </Button>
      </div>
    </div>
  );
}
