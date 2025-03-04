import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from '../../lib/axios';

import type { IOrganizationsItem } from '../../types/organization';

export function useGetOrganizations() {
  const URL = endpoints.organization.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      organizations: data?.content as IOrganizationsItem[],
      organizationsLoading: isLoading,
      organizationsError: error,
      organizationsValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}
