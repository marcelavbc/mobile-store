import { getRequestConfig } from 'next-intl/server';

// Simple i18n config for next-intl without routing
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale = defaultLocale }) => {
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
