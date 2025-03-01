import type { IPersonItem } from 'src/types/perosn';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetApprovedPersons(currentLang = 'EN') {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.person.Approved;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      approvedpersons: data?.content ?? ([] as any[]),
      approvedpersonsLoading: isLoading,
      approvedpersonsError: error,
      approvedpersonsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetPersons(currentLang = 'EN') {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.person.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      persons: data ?? ([] as IPersonItem[]),
      personsLoading: isLoading,
      personsError: error,
      personsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function UseAddPerson(data: any) {
  const res = axiosInstance.post(endpoints.person.create, data);
  return res;
}

export function useGetPerson(id: number) {
  const URL = id ? [endpoints.person.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      person: data ?? ([] as any),
      personLoading: isLoading,
      personError: error,
      personValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseCorrectPerson(data: any) {
  const res = axiosInstance.post(endpoints.person.correct, data);
  return res;
}
export function UseUpdatePerson(data: any) {
  const res = axiosInstance.post(endpoints.person.update, data);
  return res;
}
