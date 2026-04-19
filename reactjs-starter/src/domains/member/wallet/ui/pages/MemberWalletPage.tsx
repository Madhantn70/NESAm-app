import React from 'react';
import { useWalletViewModel } from '../../application/viewmodels/useWalletViewModel';
import { WalletHeader } from '../components/WalletHeader';
import { WalletCard } from '../components/WalletCard';
import { ReceiptList } from '../components/ReceiptList';
import { Header } from '../../../dashboard/ui/components/Header';

export const MemberWalletPage: React.FC = () => {
  const { wallet } = useWalletViewModel();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">
      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header — sits on background, separate from logo bar */}
      <div>
        <WalletHeader />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col flex-1 px-4 pt-5 pb-[128px] gap-6">
        {/* Wallet Card */}
        <WalletCard securityDepositBalance={wallet.securityDepositBalance} />

        {/* Receipts */}
        <ReceiptList receipts={wallet.receipts} />
      </div>

    </div>
  );
};

export default MemberWalletPage;
