import React from 'react';
import { Banknote } from 'lucide-react';
import { NotificationModel } from '../../domain/models/notification.model';

interface NotificationCardProps {
  notification: NotificationModel;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  // Bold the amount in description
  const descParts = notification.description.split(/(\$\d+)/g);

  return (
    <div
      className="bg-white rounded-[20px] p-4 flex flex-col gap-3"
      style={{ boxShadow: '0 4px 20px rgba(10, 95, 95, 0.10)' }}
    >
      {/* Top row: icon + content */}
      <div className="flex gap-3 items-start">
        {/* Icon */}
        <div className="w-11 h-11 rounded-full bg-[#E0F0F0] flex items-center justify-center shrink-0 mt-0.5">
          <Banknote className="w-5 h-5 text-[#0A5F5F]" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 flex-1">
          {/* Label */}
          <span className="text-[10px] font-bold text-[#0A5F5F] uppercase tracking-widest">
            Payment Reminder
          </span>

          {/* Title */}
          <span className="text-[16px] font-bold text-[#1A1A1A] leading-tight">
            {notification.title}
          </span>

          {/* Description with bold amount */}
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {descParts.map((part, i) =>
              /^\$\d+$/.test(part)
                ? <strong key={i} className="text-[#1A1A1A]">{part}</strong>
                : <span key={i}>{part}</span>
            )}
          </p>
        </div>
      </div>

      {/* Buttons row */}
      <div className="flex gap-3 ml-14">
        <button onClick={() => alert('Coming Soon')} className="flex-1 bg-[#0A5F5F] text-white rounded-full py-2.5 text-[13px] font-semibold hover:bg-[#084F4F] transition-colors duration-200">
          Pay Now
        </button>
        <button onClick={() => alert('Coming Soon')} className="flex-1 bg-[#EDEDED] text-gray-600 rounded-full py-2.5 text-[13px] font-semibold hover:bg-gray-200 transition-colors duration-200">
          Later
        </button>
      </div>

      {/* Due text */}
      {notification.dueText && (
        <p className="text-[12px] font-semibold" style={{ color: '#E53935' }}>
          {notification.dueText}
        </p>
      )}
    </div>
  );
};
