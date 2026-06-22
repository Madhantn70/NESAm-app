import { WalletModel } from '../../domain/models/wallet.model';
import { mockWalletData } from '../../infrastructure/mocks/wallet.mock';

export const useWalletViewModel = (): { wallet: WalletModel } => {
  return {
    wallet: mockWalletData,
  };
};
