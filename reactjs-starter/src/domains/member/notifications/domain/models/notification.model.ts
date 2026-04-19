export interface NotificationModel {
  id: string;
  type: 'DFC_REMINDER' | 'INFO';
  title: string;
  description: string;
  amount?: number;
  dueText?: string;
}

export interface DfcHistory {
  id: string;
  name: string;
  batch: string;
  paidDate: string;
  amount: number;
}
