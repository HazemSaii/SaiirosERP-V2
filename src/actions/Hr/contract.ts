import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function UseresignEmployee(data: any) {
  const res = axiosInstance.post(endpoints.contract.resignEmployee, data);
  return res;
}
export function UseterminateContract(data: any) {
  const res = axiosInstance.post(endpoints.contract.terminateContract, data);
  return res;
}
export function UsecorrectContract(data: any) {
  const res = axiosInstance.post(endpoints.contract.correctContract, data);
  return res;
}
export function UseupdateContract(data: any) {
  const res = axiosInstance.post(endpoints.contract.updateContract, data);
  return res;
}
export function useGetContractsByPersonId(personId: number) {
  const URL = personId ? [endpoints.contract.getContractsByPersonId, { params: { personId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      personContracts: data ?? ([] as any),
      personContractsLoading: isLoading,
      personContractsError: error,
      personContractsValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

