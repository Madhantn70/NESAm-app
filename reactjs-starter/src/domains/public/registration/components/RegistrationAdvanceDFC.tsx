import React from "react";
import { ShieldCheck, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/shared/Button";

interface RegistrationAdvanceDFCProps {
  onBackToSummary: () => void;
}

export function RegistrationAdvanceDFC({ onBackToSummary }: RegistrationAdvanceDFCProps) {
  const handleViewPolicy = () => {
    window.open("https://irttalumni.org", "_blank");
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Advance Community Contribution
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          Step 4 of 5: Contribution
        </p>
        <p className="text-gray-600 leading-relaxed">
          Supporting families without delay
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-gray-900 font-semibold mb-3">
            What is Advance DFC?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            NESAm collects a small advance contribution at the time of joining. This allows the community to provide immediate financial support to bereaved families without waiting for collections.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="flex-1 bg-teal-50 border border-teal-200 rounded-lg py-3 px-2 text-center"
              >
                <span className="text-xs font-medium text-teal-700">
                  DFC {num}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-500">
            Advance contribution equals multiple future DFC events.
          </p>
        </div>

        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-6 h-6 flex-shrink-0">
              <ShieldCheck className="size-6 text-green-600" />
            </div>
            <h2 className="text-gray-900 font-semibold">
              Is this refundable?
            </h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed ml-9">
            Yes. The Advance DFC amount is refundable as per NESAm policy if a member exits the program or completes lifecycle conditions.
          </p>
        </div>

        <div>
          <h2 className="text-gray-900 font-semibold mb-3">
            Why this matters
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <CheckCircle className="size-5 text-teal-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Families receive support quickly
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <CheckCircle className="size-5 text-teal-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Members avoid frequent urgent payments
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <CheckCircle className="size-5 text-teal-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Community fund stability improves
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={onBackToSummary} className="w-full">
          Back to Summary
        </Button>
        <button
          onClick={handleViewPolicy}
          className="w-full py-3 text-teal-600 font-medium hover:underline"
        >
          View DFC Policy
        </button>
      </div>
    </div>
  );
}
