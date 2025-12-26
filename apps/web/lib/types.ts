export interface Trip {
  id: number;
  uuid: string;
  title: string;
  dateStart: string;
  dateFinish: string;
  code: string;
  duration?: number | null;
  createdAt: string;
}

export interface CreateTripInput {
  title: string;
  dateStart: string;
  dateFinish: string;
  code: string;
  duration?: number | null;
}

export interface UpdateTripInput {
  title?: string;
  dateStart?: string;
  dateFinish?: string;
  code?: string;
  duration?: number | null;
}
