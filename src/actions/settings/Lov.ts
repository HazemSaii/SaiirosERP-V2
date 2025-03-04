import type { ILOVItem } from 'src/types/Lov';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';

export function useGetDistinctLookup(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
    const URL = endpoints.listOfValues.list;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        lookups: data as ILOVItem[],
        lookupsLoading: isLoading,
        lookupsError: error,
        lookupsValidating: isValidating,
      }),
      [data, error, isLoading, isValidating]
    );
    return memoizedValue;
}
// export function useGetAllLookups(typeCode:string,currentLang:string) {
//   const config = {
//     headers: {
//     'Lang': currentLang.toUpperCase(),
//     }
//   };
//    const URL = `${endpoints.listOfValues.list}?typeCode=${typeCode}`;

//     const { data, isLoading, error, isValidating } = useSWR([URL, config],fetcher, {
//       revalidateIfStale: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false
//     });
//     const memoizedValue = useMemo(
//       () => ({
//         lookups: data ??[] as any[],
//         lookupsLoading: isLoading,
//         lookupsError: error,
//         lookupsValidating: isValidating,
//       }),
//       [data, error, isLoading, isValidating]
//     );
//     return memoizedValue;
// }
export function useGetLOV(typeCode: string) {
  const URL = typeCode ? [endpoints.listOfValues.details, { params: { typeCode } }] : '';
  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      ListOfValues: data as any,
      ListOfValuesLoading: isLoading,
      ListOfValuessError: error,
      ListOfValuesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function useDeleteLOV(ListOfValues: string){
  const res = axiosInstance.delete(endpoints.listOfValues.delete, { params: { ListOfValues } });
   return res;
}

export function useAddLOV(data: any) {
  const res = axiosInstance.post(endpoints.listOfValues.create, data);
  return res;
}


export function useEditLOV(data: any) {
  const res = axiosInstance.post(endpoints.listOfValues.edit, data);
  return res;
}
