import HttpBackend from 'i18next-http-backend';
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

const development = process.env.NODE_ENV === 'development';

const nextI18NextConfig = {
  backend: {
    backendOptions: [
      { expirationTime: development ? 0 : 60 * 60 * 1000 },
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      }
    ],
    backends: typeof window !== 'undefined' ? [LocalStorageBackend, HttpBackend] : []
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    defaultNS: 'common',
    ns: [
      'common',
      'contacts',
      'content-management',
      'country',
      'currency',
      'invoicing',
      'logger',
      'permissions',
      'settings',
      'social-title'
    ]
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  use: typeof window !== 'undefined' ? [ChainedBackend] : [],
  localeDetection: false
};

export default nextI18NextConfig;
