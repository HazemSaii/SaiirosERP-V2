import type { ICountriesItem } from 'src/types/countries';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';

export function useGetCountries(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
    const URL = endpoints.countries.list;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        countries: data?.content as ICountriesItem[],
        countriesLoading: isLoading,
        countriesError: error,
        countriesValidating: isValidating,
      }),
      [data?.content, error, isLoading, isValidating]
    );
    return memoizedValue;
}

export function useGetCountry(countryCode: string) {
  //di el distinct 
  const URL = countryCode ? [endpoints.countries.details, { params: { countryCode } }] : '';
  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      countries: data as any,
      countriesLoading: isLoading,
      countriesError: error,
      countriesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function useDeleteCountry(countryCode: string){
  const res = axiosInstance.delete(endpoints.countries.delete, { params: { countryCode } });
   return res;
}

export function useAddCountry(data: any) {
  const res = axiosInstance.post(endpoints.countries.create, data);
  return res;
}

export function useEditCountry(id: any) {
  const res = axiosInstance.post(endpoints.countries.edit, id);
  return res;
}