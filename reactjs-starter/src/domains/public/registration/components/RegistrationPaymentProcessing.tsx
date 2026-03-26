import React from "react";
import { ShieldCheck } from "lucide-react";

export function RegistrationPaymentProcessing() {
  const handleNeedHelp = () => {
    window.location.href = "mailto:nesam@irttalumni.org";
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center justify-center animate-in fade-in duration-300 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Your Contribution
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Please wait while we confirm your payment
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <p className="text-sm text-gray-900 font-medium text-center">
          Connecting to secure payment gateway…
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldCheck className="size-6 text-green-600" />
          </div>

          <h2 className="text-gray-900 font-semibold text-center">
            Secure Transaction
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed text-center">
            Your payment is being processed through a certified and encrypted payment gateway.{" "}
            <span className="font-medium">Please do not close this screen or press back.</span>
          </p>

          <p className="text-xs text-gray-500 text-center">
            This usually takes a few seconds.
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={handleNeedHelp}
          className="text-sm text-teal-600 hover:underline"
        >
          Need Help?
        </button>
      </div>
    </div>
  );
}
