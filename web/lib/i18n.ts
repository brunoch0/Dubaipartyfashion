export const LOCALES = ['en', 'ko', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/** English is the primary language. */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Locales offered in the language switcher. Routes stay functional for all
 * LOCALES — to hide Korean from the UI later, just remove 'ko' here.
 */
export const VISIBLE_LOCALES: readonly Locale[] = ['en', 'ko', 'ar'];

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** Multilingual jsonb field: {"ko":"...","en":"...","ar":"..."} */
export type MLText = Partial<Record<Locale, string>> | null | undefined;

/** Fallback chain: requested -> en -> ko -> ar */
export function pick(field: MLText, locale: Locale): string {
  if (!field) return '';
  return field[locale] || field.en || field.ko || field.ar || '';
}

export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-AE',
  ko: 'ko-KR',
  ar: 'ar-AE',
};

/** Event/article dates are always shown in Dubai time */
export function formatDate(
  iso: string,
  locale: Locale,
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    timeZone: 'Asia/Dubai',
    ...opts,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale: Locale): string {
  return formatDate(iso, locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
