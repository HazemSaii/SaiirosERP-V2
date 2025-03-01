import i18next from 'i18next';
import { getStorage } from 'minimal-shared/utils';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import translationAr from './langs/ar/ar.json';
import { i18nOptions, fallbackLng } from './locales-config';

// ----------------------------------------------------------------------

/**
 * [1] localStorage
 * Auto detection:
 * const lng = getStorage('i18nextLng')
 */
const lng = getStorage('i18nextLng', fallbackLng) as string;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      
      ar: { translation: translationAr },
    },
    lng, // Auto-detects or defaults
    fallbackLng: 'en',
    debug: true, // Helps in debugging issues
    interpolation: { escapeValue: false },
  });

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: Props) {
  return <Provider i18n={i18next}>{children}</Provider>;
}
