import * as locales from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';

export type LocaleCode = string;

const LOCALE_MAP: Record<string, DateFnsLocale> = {
  en: locales.enUS,
  fr: locales.fr,
  es: locales.es,
  de: locales.de,
  it: locales.it,
  pt: locales.pt,
  ru: locales.ru,
  ja: locales.ja,
  zh: locales.zhCN,
  ar: locales.ar,
  pl: locales.pl,
  nl: locales.nl
};

export const SUPPORTED_LOCALES = Object.keys(LOCALE_MAP);

// Get locale from environment variable with fallback
export const getLocaleFromEnv = (): string => {
  const lang = (process.env.NEXT_PUBLIC_LANG || 'fr').toLowerCase();
  return LOCALE_MAP[lang] ? lang : 'fr';
};

// Get date-fns locale object based on language code
export const getDateFnsLocale = (localeCode: LocaleCode = getLocaleFromEnv()): DateFnsLocale => {
  return LOCALE_MAP[localeCode] || LOCALE_MAP['fr'];
};
