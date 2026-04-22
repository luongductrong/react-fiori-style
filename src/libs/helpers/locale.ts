import { APP_LOCALE } from '@/app-constant';

function getAcceptLanguage() {
  const locale = APP_LOCALE;

  return locale.split('-')[0];
}

export { getAcceptLanguage };
