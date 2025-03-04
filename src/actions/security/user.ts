import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';

import type { IUserItem } from '../../types/user';
import type { IRoleItem } from '../../types/role';

export function useGetUsers() {
  const URL = endpoints.user.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      users: data?.content ?? ([] as IUserItem[]),
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function useGetRolesByUser(userId: string) {
  const URL = userId ? [endpoints.user.getRolesByUser, { params: { userId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      roles: data as IRoleItem[],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useAddUser(user: any) {
  const res = axiosInstance.post(endpoints.user.create, user);
  return res;
}
export function useEditUser(user: any) {
  const res = axiosInstance.post(endpoints.user.edit, user);
  return res;
}
export function useValidateUser(user: any, operation: number) {
  const res = axiosInstance.post(`${endpoints.user.validate}/${operation}`, user);
  return res;
}
export function useAddUserRoles(userRoles: any) {
  const res = axiosInstance.post(endpoints.user.addUserRoles, userRoles);
  return res;
}
export function useEditUserRoles(userRoles: any) {
  const res = axiosInstance.post(endpoints.user.editUserRoles, userRoles);
  return res;
}

export function useGetUser(id: string) {
  const URL = id ? [endpoints.user.details, { params: { id } }] : '';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      user: data as IUserItem,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function useDeleteUser(id: string) {
  const res = axiosInstance.delete(endpoints.user.delete, { params: { id } });
  return res;
}
export function useResetPassword(user: any) {
  const res = axiosInstance.post(endpoints.user.resetPassword, user);
  return res;
}

export function useGetDataAccessByUser(userId: string) {
  const URL = userId ? [endpoints.user.getDataAccessByUser, { params: { userId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      dataAccess: data as any[],
      dataAccessLoading: isLoading,
      dataAccessError: error,
      dataAccessValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function useAddUserDataAccess(dataAccess: any) {
  const res = axiosInstance.post(endpoints.user.addUserDataAccess, dataAccess);
  return res;
}

export function useUpdateUserDataAccess(dataAccess: any) {
  const res = axiosInstance.post(endpoints.user.updateUserDataAccess, dataAccess);
  return res;
}
