import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetGradeRates(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.gradeRates.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      gradeRates: data?.content ?? ([] as any[]),
      gradeRatesLoading: isLoading,
      gradeRatesError: error,
      gradeRatesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function useGetApprovedGradeRates(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.gradeRates.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      approvedgradeRates: data?.content ?? ([] as any[]),
      approvedgradeRatesLoading: isLoading,
      approvedgradeRatesError: error,
      approvedgradeRatesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddGradeRates(data: any) {
  const res = axiosInstance.post(endpoints.gradeRates.create, data);
  return res;
}

export function useGetGradeRate(id: number) {
  const URL = id ? [endpoints.gradeRates.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      gradeRate: data ?? ([] as any),
      gradeRateLoading: isLoading,
      gradeRateError: error,
      gradeRateValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteGradeRate(id: string) {
  const res = axiosInstance.delete(endpoints.gradeRates.delete, { params: { id } });
  return res;
}

export function UseEditGradeRate(organization: any) {
  const res = axiosInstance.post(endpoints.gradeRates.edit, organization);
  return res;
}


