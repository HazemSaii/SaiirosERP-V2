import type { ICurrenciesItem } from 'src/types/curriencies';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetCurrencies(currentLang:string) {
  const config = {
    headers: {
      'Lang': currentLang.toUpperCase(),
    }
  };
    const URL = endpoints.currencies.list;
    const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher,{
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });
    const memoizedValue = useMemo(
      () => ({
        currencies: data?.content as ICurrenciesItem[],
        currenciesLoading: isLoading,
        currenciesError: error,
        currenciesValidating: isValidating,
      }),
      [data?.content, error, isLoading, isValidating]
    );
    return memoizedValue;
}

export function useGetCurrency(currencyCode: string) {
  
  const URL = currencyCode ? [endpoints.currencies.details, { params: { currencyCode } }] : '';
  const { data, isLoading, error, isValidating,mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      currencies: data as any,
      currenciesLoading: isLoading,
      currenciesError: error,
      currenciesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
  
}

export function useDeleteCurrencies(currencyCode: string){
  const res = axiosInstance.delete(endpoints.currencies.delete, { params: { currencyCode } });
   return res;
}

export function useAddCurrencies(data: any) {
  const res = axiosInstance.post(endpoints.currencies.create, data);
  return res;
}

export function useEditCurrencies(id: any) {
  const res = axiosInstance.post(endpoints.currencies.edit, id);
  return res;
}