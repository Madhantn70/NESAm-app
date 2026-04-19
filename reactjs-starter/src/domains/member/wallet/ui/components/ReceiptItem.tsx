import React from 'react';
import { Receipt } from '../../domain/types/receipt.type';
import { FileText, Download } from 'lucide-react';

interface ReceiptItemProps {
  receipt: Receipt;
}

export const ReceiptItem: React.FC<ReceiptItemProps> = ({ receipt }) => {
  const formattedAmount = receipt.amount.toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-[16px] px-4 py-4 flex items-center gap-4 shadow-sm">
      {/* Document icon */}
      <div className="w-11 h-11 rounded-full bg-[#E0F4F4] flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-[#006A6A]" />
      </div>

      {/* Center content */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-gray-800 truncate">
          {receipt.name} - {receipt.batch}
        </span>
        <span className="text-[12px] text-gray-400 mt-0.5">
          Paid on {receipt.paidDate}
        </span>
        <span className="text-[15px] font-bold text-[#006A6A] mt-1">
          ₹{formattedAmount}
        </span>
      </div>

      {/* Download icon – UI only, no action */}
      <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
        <Download className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
};
