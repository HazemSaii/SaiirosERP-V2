import type { IPasswordPolicy } from 'src/types/password_policy';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';

// export function useGetPasswordPolicy(policyId:any){
//     const res = axiosInstance.get(endpoints.resetPassword.getPasswordPolicy, policyId);
//     return res;
// }

export function useUpdatePasswordPolicy(policy: any) {
  const res = axiosInstance.post(endpoints.resetPassword.updatePasswordPolicy, policy);
  return res;
}

export function useGetPasswordPolicy(id: string) {
  const URL = id ? [endpoints.resetPassword.getPasswordPolicy, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      policy: data as IPasswordPolicy,
      policyLoading: isLoading,
      policyError: error,
      policyValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
