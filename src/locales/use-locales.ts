import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { localStorageGetItem } from 'src/utils/storage-available';

import { toast } from 'src/components/snackbar';

import { allLangs , defaultLang } from './all-langs';
import { fallbackLng, changeLangMessages as messages } from './locales-config';

import type { LanguageValue } from './locales-config';

// ----------------------------------------------------------------------
export function useLocales() {
  const langStorage = localStorageGetItem('i18nextLng');
  const currentLang = allLangs.find((lang) => lang.value === langStorage) || defaultLang;
  return {
    allLangs,
    currentLang,
  };
}
export function useTranslate(ns?: string) {
  const { t, i18n } = useTranslation(ns);

  const fallback = allLangs.filter((lang) => lang.value === fallbackLng)[0];

  const currentLang = allLangs.find((lang) => lang.value === i18n.resolvedLanguage);

  const onChangeLang = useCallback(
    async (newLang: LanguageValue) => {
      try {
        const langChangePromise = i18n.changeLanguage(newLang);

        const currentMessages = messages[newLang] || messages.en;

        toast.promise(langChangePromise, {
          loading: currentMessages.loading,
          success: () => currentMessages.success,
          error: currentMessages.error,
        });

        if (currentLang) {
          dayjs.locale(currentLang.adapterLocale);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [currentLang, i18n]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLang: currentLang ?? fallback,
  };
}
