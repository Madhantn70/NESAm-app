import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/shared/Button";

interface RegistrationNotFoundProps {
  onBack: () => void;
}

export function RegistrationNotFound({ onBack }: RegistrationNotFoundProps) {
  const handleVisitAlumniWebsite = () => {
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
        Alumni Record Not Found
      </h1>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <p className="text-gray-700 text-center leading-relaxed">
          We could not find your details in the Alumni database.
        </p>
        <p className="text-gray-700 text-center leading-relaxed mt-4">
          Please register with the Alumni Association first.
        </p>
        <p className="text-gray-500 text-center text-sm leading-relaxed mt-4">
          If you recently updated your details, please try again later or contact support.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handleVisitAlumniWebsite} className="w-full">
          Visit Alumni Website
        </Button>
        <Button onClick={onBack} variant="outline" className="w-full">
          Try Another Email
        </Button>
      </div>
    </div>
  );
}
