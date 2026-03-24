import React from "react";
import { AlertCircle, X, Wifi, CreditCard, Clock } from "lucide-react";
import { Button } from "../../../components/shared/Button";

interface RegistrationPaymentFailureProps {
  onRetryPayment: () => void;
}

export function RegistrationPaymentFailure({ onRetryPayment }: RegistrationPaymentFailureProps) {
  const handleContactSupport = () => {
    window.location.href = "mailto:nesam@irttalumni.org";
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 py-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
          <AlertCircle className="size-12 text-orange-600" />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Payment Not Completed
        </h1>
        <p className="text-gray-600 leading-relaxed text-sm">
          Your contribution could not be processed. No amount has been deducted or the transaction is incomplete.
        </p>
      </div>

      <div className="bg-orange-50/50 rounded-xl border border-orange-200 p-6 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-4 text-center">
          Possible Reasons
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <X className="size-5 text-orange-700" />
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              Payment was cancelled
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <Wifi className="size-5 text-orange-700" />
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              Network interruption
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <CreditCard className="size-5 text-orange-700" />
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              Bank declined the transaction
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <Clock className="size-5 text-orange-700" />
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              Session timeout
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-sm text-gray-700 leading-relaxed text-center">
          You can safely retry the payment.
          <br /><br />
          If any amount was debited, it will be automatically refunded by your bank within standard timelines.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={onRetryPayment} className="w-full">
          Retry Secure Payment
        </Button>

        <div className="text-center">
          <button
            onClick={handleContactSupport}
            className="text-sm text-teal-600 hover:underline"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
