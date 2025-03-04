import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../../lib/axios';

export function useGetAllApplications(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.applications.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      applications:  data?.content ?? ([] as any[]),
      applicationsLoading: isLoading,
      applicationsError: error,
      applicationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [ data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
