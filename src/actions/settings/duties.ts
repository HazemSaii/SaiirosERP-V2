import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetAllDuties(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.duties.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      duties: data?.content ?? ([] as any[]),
      dutiesLoading: isLoading,
      dutiesError: error,
      dutiesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddDuity(data: any) {
  const res = axiosInstance.post(endpoints.duties.create, data);
  return res;
}

export function useGetDuty(dutyCode: string) {
  const URL = dutyCode ? [endpoints.duties.details, { params: { dutyCode } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      duty: data ?? ([] as any),
      dutyLoading: isLoading,
      dutyError: error,
      dutyValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteDuty(dutyCode: string) {
  const res = axiosInstance.delete(endpoints.duties.delete, { params: { dutyCode } });
  return res;
}

export function UseEditDuty(duty: any) {
  const res = axiosInstance.post(endpoints.duties.edit, duty);
  return res;
}
