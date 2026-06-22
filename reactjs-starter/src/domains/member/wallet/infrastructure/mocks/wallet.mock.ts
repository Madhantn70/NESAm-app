import { WalletModel } from '../../domain/models/wallet.model';

export const mockWalletData: WalletModel = {
  securityDepositBalance: 2500,
  receipts: [
    { id: '1', name: 'Anitha.K', batch: 'Batch 1999', paidDate: 'Oct 19 2025', amount: 1000 },
    { id: '2', name: 'Dharani.S', batch: 'Batch 2001', paidDate: 'Sep 21 2024', amount: 500 },
    { id: '3', name: 'Devi.G', batch: 'Batch 1960', paidDate: 'Jan 23 2024', amount: 1000 },
  ],
};
