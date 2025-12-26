import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';
import type { CreateTripInput, UpdateTripInput } from '@/lib/types';

const TRIPS_QUERY_KEY = ['trips'];

export function useTrips() {
  return useQuery({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: () => tripsApi.getAll(),
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, id],
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTripInput) => tripsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTripInput }) =>
      tripsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tripsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
    },
  });
}
