import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetOrganizations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.organization.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      organizations: data?.content ?? ([] as any[]),
      organizationsLoading: isLoading,
      organizationsError: error,
      organizationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function useGetApprovedOrganizations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.organization.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      approvedorganizations: data?.content ?? ([] as any[]),
      approvedorganizationsLoading: isLoading,
      approvedorganizationsError: error,
      approvedorganizationsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function UseAddOrganization(organization: any) {
  const res = axiosInstance.post(endpoints.organization.create, organization);
  return res;
}

export function useGetOrganization(id: number) {
  const URL = id ? [endpoints.organization.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      organization: data ?? ([] as any),
      organizationLoading: isLoading,
      organizationError: error,
      organizationValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteOrganization(id: string) {
  const res = axiosInstance.delete(endpoints.organization.delete, { params: { id } });
  return res;
}

export function UseEditOrganization(organization: any) {
  const res = axiosInstance.post(endpoints.organization.edit, organization);
  return res;
}

// export function useValidateOrganization(organization:any,operation:number){
//   const res = axiosInstance.post(`${endpoints.organization.validate}?operation=${operation}`, organization);
//   return res;
// }
