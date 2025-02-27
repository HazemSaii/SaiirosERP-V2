import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';




export function UseAddFamily(data: any) {
  const res = axiosInstance.post(endpoints.family.Add, data);
  return res;
}
export function UseEditpersonfamily(data: any) {
  const res = axiosInstance.post(endpoints.family.edit, data);
  return res;
}

export function UseGetpersonfamily(id: number) {
  const URL = id 
  ? `${endpoints.family.details}?id=${id}&pageNo=1&pageSize=1000000&orderBy=firstName&asc=true` 
  : '';
    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      personfamily: data?.content ?? ([] as any[]),
      personfamilyLoading: isLoading,
      personfamilyError: error,
      personfamilyValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

