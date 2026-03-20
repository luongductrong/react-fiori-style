import qs from "qs";
import { ODATA_HOST } from "@/app-constant";
import axios, { type AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

const api = axios.create({
  baseURL: ODATA_HOST,
  timeout: 30000,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      encode: false,
    }),
});

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    if (
      !config.headers["Content-Type"] &&
      config.data &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    const token = response?.headers?.["x-csrf-token"];
    if (token) {
      sessionStorage.setItem("x-csrf-token", token);
    }
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token was expired or invalid!");
    }
    return Promise.reject(error);
  },
);

type HttpClient = {
  get<T = unknown>(_url: string, _config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(_url: string, _config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(
    _url: string,
    _data?: D,
    _config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = unknown, D = unknown>(
    _url: string,
    _data?: D,
    _config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = unknown, D = unknown>(
    _url: string,
    _data?: D,
    _config?: AxiosRequestConfig,
  ): Promise<T>;
};

export const axiosInstance: HttpClient = {
  get: (url, config) => api.get(url, config),
  delete: (url, config) => api.delete(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
};
