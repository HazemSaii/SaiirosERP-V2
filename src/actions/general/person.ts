import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from '../../lib/axios';

import type { IPersonItem } from '../../types/perosn';

export function useGetPersons(currentLang = 'EN') {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.person.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher);
  const memoizedValue = useMemo(
    () => ({
      persons: data ?? ([] as IPersonItem[]),
      personsLoading: isLoading,
      personsError: error,
      personsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
