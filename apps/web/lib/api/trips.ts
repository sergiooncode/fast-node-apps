import type { Trip, CreateTripInput, UpdateTripInput } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const tripsApi = {
  async getAll(): Promise<Trip[]> {
    const response = await fetch(`${API_BASE_URL}/trips`);
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return response.json();
  },

  async getById(id: number): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trip');
    }
    return response.json();
  },

  async create(input: CreateTripInput): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error('Failed to create trip');
    }
    return response.json();
  },

  async update(id: number, input: UpdateTripInput): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error('Failed to update trip');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete trip');
    }
  },
};
