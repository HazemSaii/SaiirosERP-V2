import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../../lib/axios';

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetMenus(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.shared.getMenues;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      menus: data as any[],
      menusLoading: isLoading,
      menusError: error,
      menusValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
