<<<<<<< HEAD
import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';
import { IUserDutiesItem } from 'src/types/userDuties';

export function useGetAllUserDuties(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.userDuties.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
=======
import type { IUserDutiesItem } from 'src/types/userDuties';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

export function useGetAllUserDuties(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
  const URL = endpoints.userDuties.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL , config], fetcher, {
>>>>>>> 3ecc3e8d54e6a67eac275d24339e449149565081
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
<<<<<<< HEAD
      userDuties: data?.content as IUserDutiesItem[],
=======
      userDuties:data?.content as IUserDutiesItem[],
>>>>>>> 3ecc3e8d54e6a67eac275d24339e449149565081
      userDutiesLoading: isLoading,
      userDutiesError: error,
      userDutiesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
<<<<<<< HEAD
export function useGetApprovedUserDuties(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.userDuties.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
=======
export function useGetApprovedUserDuties(currentLang:string) {
  const config = {
    headers: {
       'Lang': currentLang.toUpperCase(),
     }
   };
  const URL = endpoints.userDuties.Approved;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL , config], fetcher, {
>>>>>>> 3ecc3e8d54e6a67eac275d24339e449149565081
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
<<<<<<< HEAD
      approveduserDuties: data?.content as IUserDutiesItem[],
=======
      approveduserDuties:data?.content as IUserDutiesItem[],
>>>>>>> 3ecc3e8d54e6a67eac275d24339e449149565081
      approveduserDutiesLoading: isLoading,
      approveduserDutiesError: error,
      approveduserDutiesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddUserDuity(data: any) {
  const res = axiosInstance.post(endpoints.userDuties.create, data);
  return res;
}

export function useGetUserDuity(id: string) {
  const URL = id ? [endpoints.userDuties.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      duty: data as any,
      dutyLoading: isLoading,
      dutyError: error,
      dutyValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteUserDuty(id: string) {
  const res = axiosInstance.delete(endpoints.userDuties.delete, { params: { id } });
  return res;
}

export function UseEditUserDuty(userDuty: any) {
  const res = axiosInstance.post(endpoints.userDuties.edit, userDuty);
  return res;
}
