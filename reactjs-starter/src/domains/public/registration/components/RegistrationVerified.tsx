import React from "react";
import { Button } from "@/shared/components/shared/Button";
import { CheckCircle } from "lucide-react";
import { AlumniViewData } from "@/domains/public/registration/models/view/registration";
import { maskEmail } from "@/domains/public/registration/mappers/registrationMapper";

interface RegistrationVerifiedProps {
  alumniData: AlumniViewData | null;
  onContinue: () => void;
  onTryAnother: () => void;
}

export function RegistrationVerified({
  alumniData,
  onContinue,
  onTryAnother,
}: RegistrationVerifiedProps) {
  if (!alumniData) return null;

  return (
    <div className="flex flex-col gap-8 pt-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-teal-600" />
        </div>
      </div>

      <h1 className="text-center text-xl font-semibold text-gray-900">Alumni Verified</h1>

      <div className="text-center">
        <p className="text-gray-900 text-lg">Is this you?</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Name</span>
            <span className="text-gray-900 font-medium">{alumniData.name}</span>
          </div>
          <div className="w-full h-px bg-gray-200"></div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Batch</span>
            <span className="text-gray-900 font-medium">{alumniData.batch}</span>
          </div>
          <div className="w-full h-px bg-gray-200"></div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Department</span>
            <span className="text-gray-900 font-medium">{alumniData.department}</span>
          </div>
          <div className="w-full h-px bg-gray-200"></div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Registered Email</span>
            <span className="text-gray-900 font-medium">{maskEmail(alumniData.email)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={onContinue}>
          Yes, Continue NESAm Registration
        </Button>
        <Button onClick={onTryAnother} variant="outline">
          Not Me – Try Another Email
        </Button>
      </div>
    </div>
  );
}
