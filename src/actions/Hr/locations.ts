import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetLocations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.location.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      locations: data?.content as any[],
      locationsLoading: isLoading,
      locationsError: error,
      locationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function useGetApprovedLocations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.location.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      approvedlocations: data?.content as any[],
      approvedlocationsLoading: isLoading,
      approvedlocationsError: error,
      approvedlocationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddLocation(location: any) {
  const res = axiosInstance.post(endpoints.location.create, location);
  return res;
}
export function UseEditLocation(location: any) {
  const res = axiosInstance.post(endpoints.location.edit, location);
  return res;
}

export function UseGetLocation(locationId: number) {
  const URL = locationId ? [endpoints.location.details, { params: { locationId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      location: data as any,
      locationLoading: isLoading,
      locationError: error,
      locationValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteLocation(locationId: string) {
  const res = axiosInstance.delete(endpoints.location.delete, { params: { locationId } });
  return res;
}

export function UseValidateLocation(location: any, operation: number) {
  const res = axiosInstance.post(`${endpoints.location.validate}?operation=${operation}`, location);
  return res;
}
