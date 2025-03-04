import useSWR from 'swr';
import { useMemo } from 'react';

<<<<<<< HEAD
import axiosInstance, { fetcher, endpoints } from '../../lib/axios';
=======
import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';
>>>>>>> 3ecc3e8d54e6a67eac275d24339e449149565081


export function UseAddTimezone(timezone: any) {
    const res = axiosInstance.post(endpoints.timezones.create, timezone);
    return res;
  }

  export function useGetTimezone(timezoneId: number) {
    const URL = timezoneId ? [endpoints.timezones.details, { params: { timezoneId } }] : '';
    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });
    const memoizedValue = useMemo(
      () => ({
        timezone: data ?? ([] as any),
        timezoneLoading: isLoading,
        timezoneError: error,
        timezoneValidating: isValidating,
        refetch: () => mutate(),
      }),
      [data, error, isLoading, isValidating, mutate]
    );
  
    return memoizedValue;
  }
  
  export function UseDeleteTimezone(timezoneId: string) {
    const res = axiosInstance.delete(endpoints.timezones.delete, { params: { timezoneId } });
    return res;
  }
  
  export function UseEditTimezone(timezone: any) {
    const res = axiosInstance.post(endpoints.timezones.edit, timezone);
    return res;
  }