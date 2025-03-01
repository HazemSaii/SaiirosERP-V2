
import type { IJobFamiliesItem } from 'src/types/jobsFamilies';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function UseGetJobFamilies(currentLang:string) {
    const config = {
      headers: {
         'Lang': currentLang.toUpperCase(),
       }
     };
      const URL = endpoints.jobFamilies.list;
      const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      });
      const memoizedValue = useMemo(
        () => ({
          jobFamilies: data?.content as IJobFamiliesItem[],
          jobFamiliesLoading: isLoading,
          jobFamiliesError: error,
          jobFamiliesValidating: isValidating,
        }),
        [data?.content, error, isLoading, isValidating]
      );
      return memoizedValue;
}
export function UseGetApprovedJobFamilies(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
    const URL = endpoints.jobFamilies.Approved;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        approvedjobFamilies: data?.content as IJobFamiliesItem[],
        approvedjobFamiliesLoading: isLoading,
        approvedjobFamiliesError: error,
        approvedjobFamiliesValidating: isValidating,
      }),
      [data?.content, error, isLoading, isValidating]
    );
    return memoizedValue;
}

export function UseGetJobFamilie(id: number) {
  
  const URL = id ? [endpoints.jobFamilies.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      jobFamilies: data as any,
      jobFamiliesLoading: isLoading,
      jobFamiliesError: error,
      jobFamiliesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function UseDeleteJobFamilies(id: string){
  const res = axiosInstance.delete(endpoints.jobFamilies.delete, { params: { id } });
   return res;
}

export function UseAddJobFamilies(data: any) {
  const res = axiosInstance.post(endpoints.jobFamilies.create, data);
  return res;
}

export function UseEditJobFamilies(id: any) {
  const res = axiosInstance.post(endpoints.jobFamilies.edit, id);
  return res;
}