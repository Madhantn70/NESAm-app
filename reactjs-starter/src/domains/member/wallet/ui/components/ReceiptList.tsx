import React from 'react';
import { Receipt } from '../../domain/types/receipt.type';
import { ReceiptItem } from './ReceiptItem';

interface ReceiptListProps {
  receipts: Receipt[];
}

export const ReceiptList: React.FC<ReceiptListProps> = ({ receipts }) => {
  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-[16px] font-bold text-gray-800 mb-4">Receipts</h2>
      <div className="flex flex-col gap-4">
        {receipts.map((receipt) => (
          <ReceiptItem key={receipt.id} receipt={receipt} />
        ))}
      </div>
    </div>
  );
};
