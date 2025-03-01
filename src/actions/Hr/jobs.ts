import type { IJobsItem } from 'src/types/jobs';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetJobs(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
    const URL = endpoints.jobs.list;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        jobs: data?.content as IJobsItem[],
        jobsLoading: isLoading,
        jobsError: error,
        jobsValidating: isValidating,
      }),
      [data?.content, error, isLoading, isValidating]
    );
    return memoizedValue;
}
export function useGetApprovedJobs(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
    const URL = endpoints.jobs.Approved;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        approvedjobs: data?.content as IJobsItem[],
        approvedjobsLoading: isLoading,
        approvedjobsError: error,
        approvedjobsValidating: isValidating,
      }),
      [data?.content, error, isLoading, isValidating]
    );
    return memoizedValue;
}

export function useGetJob(id: number) {
  
  const URL = id ? [endpoints.jobs.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      jobs: data as any,
      jobsLoading: isLoading,
      jobsError: error,
      jobsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function useDeleteJobs(jobId: string){
  const res = axiosInstance.delete(endpoints.jobs.delete, { params: { jobId } });
   return res;
}

export function useAddJobs(data: any) {
  const res = axiosInstance.post(endpoints.jobs.create, data);
  return res;
}

export function useEditJobs(id: any) {
  const res = axiosInstance.post(endpoints.jobs.edit, id);
  return res;
}