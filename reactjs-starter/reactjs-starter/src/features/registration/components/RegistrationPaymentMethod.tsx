import React from "react";
import { ShieldCheck, CheckCircle, Lock } from "lucide-react";

interface RegistrationPaymentMethodProps {
  totalPayable: number;
  onPayOnline: () => void;
}

export function RegistrationPaymentMethod({ totalPayable, onPayOnline }: RegistrationPaymentMethodProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Contribution
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          Step 5 of 5: Payment
        </p>
        <p className="text-gray-600 leading-relaxed">
          Secure online payment for instant NESAm membership activation.
        </p>
      </div>

      <div className="bg-teal-50 rounded-2xl border-2 border-teal-100 p-6">
        <p className="text-center text-gray-900 leading-relaxed mb-1">
          Pay <span className="text-3xl font-bold text-teal-600 ml-1">₹{totalPayable.toLocaleString("en-IN")}</span> to activate NESAm membership
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-teal-100 p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
            <ShieldCheck className="size-8 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center">
            Pay Online
          </h2>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed text-center mb-6">
          Use UPI, Netbanking, Debit/Credit Card, or Wallet for instant confirmation.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <CheckCircle className="size-5 text-teal-600" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Instant membership activation
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <CheckCircle className="size-5 text-teal-600" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Fully secure payment gateway
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <CheckCircle className="size-5 text-teal-600" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Digital receipt generated automatically
            </p>
          </div>
        </div>

        <button
          onClick={onPayOnline}
          className="w-full bg-teal-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-base"
        >
          Proceed to Secure Payment
        </button>
      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 flex-shrink-0">
            <Lock className="size-5 text-green-700" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            All payments are processed through a certified payment gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
