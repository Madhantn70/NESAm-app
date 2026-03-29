import React from 'react';
import { Calendar, IndianRupee, Clock } from 'lucide-react';

/**
 * Event card for Active DFC events.
 * @param {object} props
 * @param {object} props.event
 * @param {string} props.event.id
 * @param {string} props.event.name
 * @param {number} props.event.batch
 * @param {string} props.event.dueDate
 * @param {number} props.event.collected
 * @param {number} props.event.pending
 */
export function EventCard({ event }) {
  const { name, batch, dueDate, collected, pending } = event;

  // Format the due date nicely
  const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate progress percentage (collected out of collected + pending)
  const total = collected + pending;
  const progressPercent = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="event-card">
      {/* Header Row */}
      <div className="event-card__header">
        <h3 className="event-card__name">{name}</h3>
        <span className="event-card__batch">Batch {batch}</span>
      </div>

      {/* Due Date */}
      <div className="event-card__meta">
        <Calendar size={16} className="event-card__meta-icon" />
        <span>Due: {formattedDate}</span>
      </div>

      {/* Progress Bar */}
      <div className="event-card__progress-track">
        <div
          className="event-card__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stats Row */}
      <div className="event-card__stats">
        <div className="event-card__stat event-card__stat--collected">
          <IndianRupee size={14} />
          <span className="event-card__stat-value">₹{collected.toLocaleString('en-IN')}</span>
          <span className="event-card__stat-label">Collected</span>
        </div>
        <div className="event-card__stat event-card__stat--pending">
          <Clock size={14} />
          <span className="event-card__stat-value">{pending}</span>
          <span className="event-card__stat-label">Pending</span>
        </div>
      </div>
    </div>
  );
}
