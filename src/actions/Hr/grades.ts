import type { IGradesItem } from 'src/types/grades';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function UseGetGrades(currentLang:string) {
     const config = {
       headers: {
         'Lang': currentLang.toUpperCase(),
       }
     };
      const URL = endpoints.Grades.list;
      const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      });
            const memoizedValue = useMemo(
        () => ({
          Grades: data?.content??[] as IGradesItem[],
          GradesLoading: isLoading,
          GradesError: error,
          GradesValidating: isValidating,
          refetch: () => mutate(),

        }),
        [data?.content, error, isLoading, isValidating, mutate]
      );
      return memoizedValue;
}
export function UseGetApprovedGrades(currentLang:string) {
  const config = {
    headers: {
      'Lang': currentLang.toUpperCase(),
    }
  };
   const URL = endpoints.Grades.Approved;
   const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
     revalidateIfStale: true,
     revalidateOnFocus: false,
     revalidateOnReconnect: false
   });
         const memoizedValue = useMemo(
     () => ({
      approvedGrades: data?.content??[] as IGradesItem[],
      approvedGradesLoading: isLoading,
      approvedGradesError: error,
      approvedGradesValidating: isValidating,
       refetch: () => mutate(),

     }),
     [data?.content, error, isLoading, isValidating, mutate]
   );
   return memoizedValue;
}
export function UseGetGrade(id: number) {
  
  const URL = id ? [endpoints.Grades.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      Grades: data as any,
      GradesLoading: isLoading,
      GradesError: error,
      GradesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function UseDeleteGrades(id: string){
  const res = axiosInstance.delete(endpoints.Grades.delete, { params: { id } });
   return res;
}

export function UseAddGrades(data: any) {
  const res = axiosInstance.post(endpoints.Grades.create, data);
  return res;
}

export function UseEditGrades(id: any) {
  const res = axiosInstance.post(endpoints.Grades.edit, id);
  return res;
}