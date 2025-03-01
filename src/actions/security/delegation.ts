import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IDelegationItem } from 'src/types/delegation';

export function useGetDelegations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.delegations.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      delegations: data?.content as IDelegationItem[],
      delegationsLoading: isLoading,
      delegationsError: error,
      delegationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddDelegation(delegation: any) {
  const res = axiosInstance.post(endpoints.delegations.create, delegation);
  return res;
}
export function UseEditDelegation(delegation: any) {
  const res = axiosInstance.post(endpoints.delegations.edit, delegation);
  return res;
}

export function useGetDelegation(id: number) {
  const URL = id ? [endpoints.delegations.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      delegation: data as IDelegationItem,
      delegationLoading: isLoading,
      delegationError: error,
      delegationValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteDelegation(id: string) {
  const res = axiosInstance.delete(endpoints.delegations.delete, { params: { id } });
  return res;
}
