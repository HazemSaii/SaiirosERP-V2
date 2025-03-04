import type { IRoleItem, IRoleFunctionInfo } from 'src/types/role';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../../lib/axios';

export function useGetRoles(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.role.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR([URL, config], fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      roles: data?.content as IRoleItem[],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data?.content, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

export function UseAddRole(role: any) {
  const res = axiosInstance.post(endpoints.role.create, role);
  return res;
}
export function UseEditRole(role: any) {
  const res = axiosInstance.post(endpoints.role.edit, role);
  return res;
}

export function useGetRole(id: string) {
  const URL = id ? [endpoints.role.details, { params: { id } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      role: data as IRoleItem,
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseDeleteRole(id: string) {
  const res = axiosInstance.delete(endpoints.role.delete, { params: { id } });
  return res;
}

export function useGetAllFunctions() {
  const URL = endpoints.role.allFunctions;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      rolefunction: data as IRoleFunctionInfo[],
      rolefunctionLoading: isLoading,
      rolefunctionError: error,
      rolefunctionValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
export function UseAddRoleUsers(roleUsers: any) {
  const res = axiosInstance.post(endpoints.role.addRoleUsers, roleUsers);
  return res;
}
export function useGetUsersByRole(roleId: string) {
  const URL = roleId ? [endpoints.role.getUsersByRole, { params: { roleId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      users: data,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function UseAddFunctionForRole(roleFunctions: any) {
  const res = axiosInstance.post(endpoints.role.addFunctionForRole, roleFunctions);
  return res;
}

export function useGetFunctionForRole(roleId: string) {
  const URL = roleId ? [endpoints.role.getFunctionForRole, { params: { roleId } }] : '';
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const memoizedValue = useMemo(
    () => ({
      functionForRole: data,
      functionForRoleLoading: isLoading,
      functionForRoleError: error,
      functionForRoleValidating: isValidating,
      refetch: () => mutate(),
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
