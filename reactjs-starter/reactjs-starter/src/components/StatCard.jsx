import React from 'react';

/**
 * Reusable stat card for the admin dashboard.
 * @param {object} props
 * @param {string} props.title - Stat label (e.g. "New Members")
 * @param {number|string} props.value - Stat value
 * @param {string} props.subtitle - Optional subtitle text
 * @param {React.ReactNode} props.icon - Lucide icon element
 * @param {string} props.color - Accent color class (tailwind bg- class)
 */
export function StatCard({ title, value, subtitle, icon, color = 'bg-primary' }) {
  return (
    <div className="stat-card group">
      <div className={`stat-card__icon ${color}`}>
        {icon}
      </div>
      <div className="stat-card__body">
        <p className="stat-card__value">{value ?? '—'}</p>
        <p className="stat-card__title">{title}</p>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
