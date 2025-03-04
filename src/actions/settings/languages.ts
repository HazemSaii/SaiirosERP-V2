import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetAllLanguages(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.languages.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      languages: data ?? ([] as any[]),
      languagesLoading: isLoading,
      languagesError: error,
      languagesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddLanguage(data: any) {
  const res = axiosInstance.post(endpoints.languages.create, data);
  return res;
}

export function useGetlanguage(langCode: string) {
  const URL = langCode ? [endpoints.languages.details, { params: { langCode } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      language: data ?? ([] as any),
      languageLoading: isLoading,
      languageError: error,
      languageValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteLanguage(langCode: string) {
  const res = axiosInstance.delete(endpoints.languages.delete, { params: { langCode } });
  return res;
}

export function UseEditLanguage(language: any) {
  const res = axiosInstance.post(endpoints.languages.edit, language);
  return res;
}

