import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../../lib/axios';
import { ILookupItem, IApplicationItem } from '../../types/shared';
import { ITimeZoneItem } from '../../types/timezones';

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetAllApplications(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.applications.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      applications: data?.content as IApplicationItem[],
      applicationsLoading: isLoading,
      applicationsError: error,
      applicationsValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllCurrencies() {
  const URL = endpoints.currencies.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      Currencies: data?.content ?? ([] as any[]),
      CurrenciesLoading: isLoading,
      CurrenciesError: error,
      CurrenciesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllDuties() {
  const URL = endpoints.duties.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      dutes: data?.content ?? ([] as any[]),
      dutesLoading: isLoading,
      dutesError: error,
      dutesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllTimezones() {
  const URL = endpoints.shared.getAllTimeZones;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      timeZones: data?.content as ITimeZoneItem[],
      timeZonesLoading: isLoading,
      timeZonesError: error,
      timeZonesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllLookups(typeCode: string, currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = `${endpoints.listOfValues.getAllLookup}?typeCode=${typeCode}`;

  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      lookups: data ?? ([] as ILookupItem[]),
      lookupsLoading: isLoading,
      lookupsError: error,
      lookupsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllLanguages() {
  const URL = endpoints.shared.getAllLanguages;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      languages: data as any[],
      languagesLoading: isLoading,
      languagesError: error,
      languagesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllCountries(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.countries.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      countries: data?.content || [],
      countriesLoading: isLoading,
      countriesError: error,
      countriesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetMenus(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.shared.getMenues;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      menus: data as any[],
      menusLoading: isLoading,
      menusError: error,
      menusValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllLocations(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.locations.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      locations: data?.content || [],
      locationsLoading: isLoading,
      locationsError: error,
      locationsValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllLegalEnitites(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.legalEntities.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      legalEntities: data?.content || [],
      legalEntitiesLoading: isLoading,
      legalEntitiesError: error,
      legalEntitiesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllBusinessUnites(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.businessUnites.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      businessUnites: data?.content || [],
      businessUnitesLoading: isLoading,
      businessUnitesError: error,
      businessUnitesValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetAllPayrolls(currentLang: string) {
  const config = {
    headers: {
      Lang: currentLang.toUpperCase(),
    },
  };
  const URL = endpoints.payrolls.list;
  const { data, isLoading, error, isValidating } = useSWR([URL, config], fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      payrolls: data?.content || [],
      payrollsLoading: isLoading,
      payrollsError: error,
      payrollsValidating: isValidating,
    }),
    [data?.content, error, isLoading, isValidating]
  );
  return memoizedValue;
}
