import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetPositions(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.positions.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      positions: data?.content ?? ([] as any[]),
      positionsLoading: isLoading,
      positionsError: error,
      positionsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddPosition(position: any) {
  const res = axiosInstance.post(endpoints.positions.create, position);
  return res;
}

export function useGetPosition(positionId: number) {
  const URL = positionId ? [endpoints.positions.details, { params: { positionId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      position: data ?? ([] as any),
      positionLoading: isLoading,
      positionError: error,
      positionValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeletePosition(positionId: string) {
  const res = axiosInstance.delete(endpoints.positions.delete, { params: { positionId } });
  return res;
}

export function UseEditPosition(position: any) {
  const res = axiosInstance.post(endpoints.positions.edit, position);
  return res;
}

export function useGetApprovedPositions(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.positions.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      approvedpositions: data?.content ?? ([] as any[]),
      approvedpositionsLoading: isLoading,
      approvedpositionsError: error,
      approvedpositionsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
