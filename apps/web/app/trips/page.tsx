'use client';

import { useState, useEffect } from 'react';
import { tripsApi } from '@/lib/api/trips';
import type { Trip } from '@/lib/types';
import styles from './trips.module.css';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dateStart: '',
    dateFinish: '',
    code: '',
    duration: '',
  });

  const loadTrips = async () => {
    try {
      const data = await tripsApi.getAll();
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTrip = await tripsApi.create({
        title: formData.title,
        dateStart: formData.dateStart,
        dateFinish: formData.dateFinish,
        code: formData.code,
        duration: formData.duration ? parseInt(formData.duration) : null,
      });

      setTrips([newTrip, ...trips]);
      setFormData({ title: '', dateStart: '', dateFinish: '', code: '', duration: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Trips</h1>
        <div className={styles.actions}>
          <button onClick={loadTrips} className={styles.secondaryButton}>
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

          <button type="submit" className={styles.submitButton}>
            Create Trip
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
