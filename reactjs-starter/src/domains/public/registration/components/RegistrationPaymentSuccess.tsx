import React from "react";
import { CheckCircle, Download, TrendingUp } from "lucide-react";
import { Button } from "@/shared/components/shared/Button";

interface RegistrationPaymentSuccessProps {
  totalPaid: number;
  membershipPaid: number;
  advanceDFCPaid: number;
  transactionRef: string;
  memberNumber: string;
  onGoToDashboard: () => void;
}

export function RegistrationPaymentSuccess({
  totalPaid,
  membershipPaid,
  advanceDFCPaid,
  transactionRef,
  memberNumber,
  onGoToDashboard,
}: RegistrationPaymentSuccessProps) {

  const handleDownloadReceipt = () => {
    alert("Downloading receipt...");
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in zoom-in-95 duration-500 py-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
          <CheckCircle className="size-16 text-green-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Payment Successful!
        </h1>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 px-6 py-3 rounded-full border-2 border-teal-100">
          <span className="text-teal-700 font-semibold text-lg">
            You are Member #{memberNumber}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-4 text-center">
          Contribution Summary
        </h2>
        
        <div className="flex flex-col gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">Total Paid</span>
              <span className="text-2xl font-bold text-green-700">
                ₹{totalPaid.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Membership Contribution</span>
              <span className="text-gray-900 font-medium">
                ₹{membershipPaid.toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Advance DFC Contribution</span>
              <span className="text-gray-900 font-medium">
                ₹{advanceDFCPaid.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Transaction Reference ID</span>
              <span className="text-xs text-gray-900 font-mono break-all">
                {transactionRef}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 rounded-xl border border-teal-100 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 flex-shrink-0 mt-0.5">
            <TrendingUp className="size-6 text-teal-600" />
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">
            Your advance contribution helps families receive timely support.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={onGoToDashboard} className="w-full">
          Go to Dashboard
        </Button>

        <div className="text-center pt-2">
          <button
            onClick={handleDownloadReceipt}
            className="text-teal-600 hover:underline font-medium inline-flex items-center gap-2"
          >
            <Download className="size-4" />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
