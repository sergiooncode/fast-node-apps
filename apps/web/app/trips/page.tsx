'use client';

import { useState } from 'react';
import { useTrips, useCreateTrip } from '@/lib/hooks/useTrips';
import styles from './trips.module.css';

export default function TripsPage() {
  const { data: trips = [], isLoading, error, refetch } = useTrips();
  const createTripMutation = useCreateTrip();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dateStart: '',
    dateFinish: '',
    code: '',
    duration: '',
  });

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    createTripMutation.mutate(
      {
        title: formData.title,
        dateStart: formData.dateStart,
        dateFinish: formData.dateFinish,
        code: formData.code,
        duration: formData.duration ? parseInt(formData.duration) : null,
      },
      {
        onSuccess: () => {
          setFormData({ title: '', dateStart: '', dateFinish: '', code: '', duration: '' });
          setShowForm(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyState}>Loading trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyState}>Error loading trips: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Trips</h1>
        <div className={styles.actions}>
          <button onClick={() => refetch()} className={styles.secondaryButton}>
            Refresh
          </button>
          <button onClick={() => setShowForm(!showForm)} className={styles.primaryButton}>
            {showForm ? 'Cancel' : 'Create Trip'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTrip} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dateStart">Start Date</label>
              <input
                type="date"
                id="dateStart"
                value={formData.dateStart}
                onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dateFinish">Finish Date</label>
              <input
                type="date"
                id="dateFinish"
                value={formData.dateFinish}
                onChange={(e) => setFormData({ ...formData, dateFinish: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">Duration (days)</label>
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={createTripMutation.isPending}
          >
            {createTripMutation.isPending ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      )}

      <div className={styles.tripsList}>
        {trips.length === 0 ? (
          <p className={styles.emptyState}>No trips yet. Create your first trip!</p>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className={styles.tripCard}>
              <div className={styles.tripHeader}>
                <h3>{trip.title}</h3>
                <span className={styles.code}>{trip.code}</span>
              </div>
              <div className={styles.tripDetails}>
                <p>
                  <strong>Start:</strong> {trip.dateStart}
                </p>
                <p>
                  <strong>Finish:</strong> {trip.dateFinish}
                </p>
                {trip.duration && (
                  <p>
                    <strong>Duration:</strong> {trip.duration} days
                  </p>
                )}
              </div>
              <p className={styles.uuid}>ID: {trip.uuid}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
