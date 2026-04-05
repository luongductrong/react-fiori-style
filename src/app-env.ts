const env = import.meta.env;

export const IS_DEV = env.DEV;
export const IS_PROD = env.PROD;
export const VITE_MODE = env.MODE;

const ODATA_ORIGIN = env.VITE_ODATA_ORIGIN;
const GOOGLE_APP_ID = env.VITE_GOOGLE_APP_ID;
const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;

if (!ODATA_ORIGIN) {
  throw new Error('VITE_ODATA_ORIGIN is not defined in .env file');
}

if (!GOOGLE_APP_ID) {
  throw new Error('VITE_GOOGLE_APP_ID is not defined in .env file');
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('VITE_GOOGLE_CLIENT_ID is not defined in .env file');
}

export const ODATA_BASE_URL = IS_DEV ? '/api' : ODATA_ORIGIN;
export { GOOGLE_APP_ID, GOOGLE_CLIENT_ID };
