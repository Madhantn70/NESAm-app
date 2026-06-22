import { NotificationModel, DfcHistory } from '../../domain/models/notification.model';

export const mockNotifications: NotificationModel[] = [
  {
    id: '1',
    type: 'DFC_REMINDER',
    title: 'Upcoming DFC Contribution',
    description: 'A new contribution of $1000 is requested for geetha (batch 1998). Please complete the payment to maintain active status.',
    amount: 1000,
    dueText: 'Due in 3 days',
  },
  {
    id: '2',
    type: 'DFC_REMINDER',
    title: 'Upcoming DFC Contribution',
    description: 'A new contribution of $1000 is requested for geetha (batch 1998). Please complete the payment to maintain active status.',
    amount: 1000,
    dueText: 'Due in 1 day',
  },
];

export const mockDfcHistory: DfcHistory[] = [
  { id: '1', name: 'Amit sharma D', batch: 'Batch 1995', paidDate: 'Oct 15, 2025', amount: 1000 },
  { id: '2', name: 'janani S',       batch: 'Batch 1992', paidDate: 'Oct 15, 2025', amount: 1800 },
  { id: '3', name: 'Amritha D',      batch: 'Batch 2000', paidDate: 'Oct 15, 2025', amount: 1900 },
];
