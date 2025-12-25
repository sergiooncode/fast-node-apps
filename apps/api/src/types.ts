export interface Trip {
  id: number;
  uuid: string;
  dateStart: string;
  dateFinish: string;
  duration?: number | null;
  title: string;
  code: string;
  createdAt: Date;
}

export type CreateTripInput = Omit<Trip, 'id' | 'uuid' | 'createdAt'>;
export type UpdateTripInput = Partial<CreateTripInput>;
