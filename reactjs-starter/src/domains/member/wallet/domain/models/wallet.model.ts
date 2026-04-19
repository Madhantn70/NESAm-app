import { Receipt } from '../types/receipt.type';

export interface WalletModel {
  securityDepositBalance: number;
  receipts: Receipt[];
}
