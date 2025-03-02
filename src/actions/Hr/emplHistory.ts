import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';


export function UsecorrectemplHistory(data: any) {
  const res = axiosInstance.post(endpoints.emplHistory.correctHistory, data);
  return res;
}
export function UseupdateemplHistory(data: any) {
  const res = axiosInstance.post(endpoints.emplHistory.updateHistory, data);
  return res;
}
export function UseGetContractHistoriesByPersonId(personId: number) {
  const URL = personId ? [endpoints.emplHistory.getContractHistoriesByPersonId, { params: { personId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      personEmploy: data ?? ([] as any),
      personEmployLoading: isLoading,
      personEmployError: error,
      personEmployValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}