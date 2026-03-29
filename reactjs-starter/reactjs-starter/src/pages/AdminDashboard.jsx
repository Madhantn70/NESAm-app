import React, { useState, useEffect } from 'react';
import { Header } from '../components/shared/Header';
import { StatCard } from '../components/StatCard';
import { EventCard } from '../components/EventCard';
import { fetchAdminDashboard } from '../api/adminApi';
import {
  UserPlus,
  Banknote,
  CalendarCheck,
  AlertTriangle,
  LayoutDashboard,
  Users,
  PlusCircle,
  FileBarChart,
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminDashboard();
      setDashboard(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to load dashboard data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="admin-dashboard__loading">
        <div className="admin-dashboard__spinner" />
        <p className="admin-dashboard__loading-text">Loading dashboard…</p>
      </div>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <div className="admin-dashboard__error">
        <div className="admin-dashboard__error-icon">
          <AlertTriangle size={28} />
        </div>
        <p className="admin-dashboard__error-text">{error}</p>
        <button className="admin-dashboard__retry-btn" onClick={loadDashboard}>
          Retry
        </button>
      </div>
    );
  }

  const { stats, events } = dashboard || {};

  return (
    <div className="admin-dashboard">
      <Header />

      <main className="admin-dashboard__content">
        {/* Title Bar */}
        <div className="admin-dashboard__title-bar">
          <div>
            <h1 className="admin-dashboard__title">
              <LayoutDashboard size={28} />
              Admin Dashboard
            </h1>
            <p className="admin-dashboard__greeting">
              Here's what's happening today
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <section>
          <div className="admin-dashboard__stats-grid">
            <StatCard
              title="New Members"
              value={stats?.newMembers ?? 0}
              subtitle="This month"
              icon={<UserPlus size={20} />}
              color="bg-primary"
            />
            <StatCard
              title="Offline Payments"
              value={stats?.offlinePayments ?? 0}
              subtitle="Pending review"
              icon={<Banknote size={20} />}
              color="bg-secondary"
            />
            <StatCard
              title="Active DFC"
              value={stats?.activeDFC ?? 0}
              subtitle="Running events"
              icon={<CalendarCheck size={20} />}
              color="bg-success"
            />
            <StatCard
              title="Overdue"
              value={stats?.overdue ?? 0}
              subtitle="Needs attention"
              icon={<AlertTriangle size={20} />}
              color="bg-destructive"
            />
          </div>
        </section>

        {/* Active DFC Events */}
        <section>
          <h2 className="admin-dashboard__section-title">
            <CalendarCheck size={22} />
            Active DFC Events
          </h2>
          {events && events.length > 0 ? (
            <div className="admin-dashboard__events-list">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__events-empty">
              No active DFC events at the moment.
            </div>
          )}
        </section>

        {/* Admin Actions */}
        <section>
          <h2 className="admin-dashboard__section-title">Admin Actions</h2>
          <div className="admin-dashboard__actions-grid">
            <button className="admin-action-btn">
              <div className="admin-action-btn__icon admin-action-btn__icon--teal">
                <Users size={20} />
              </div>
              <div className="admin-action-btn__text">
                <span className="admin-action-btn__label">Manage Members</span>
                <span className="admin-action-btn__desc">View &amp; edit member details</span>
              </div>
            </button>

            <button className="admin-action-btn">
              <div className="admin-action-btn__icon admin-action-btn__icon--amber">
                <PlusCircle size={20} />
              </div>
              <div className="admin-action-btn__text">
                <span className="admin-action-btn__label">Create Event</span>
                <span className="admin-action-btn__desc">Start a new DFC event</span>
              </div>
            </button>

            <button className="admin-action-btn">
              <div className="admin-action-btn__icon admin-action-btn__icon--green">
                <FileBarChart size={20} />
              </div>
              <div className="admin-action-btn__text">
                <span className="admin-action-btn__label">View Reports</span>
                <span className="admin-action-btn__desc">Analytics &amp; insights</span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
