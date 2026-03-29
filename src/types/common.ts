import type { AxiosError } from 'axios';

export type SearchHelpKey = 'contains' | 'equal to' | 'starts with' | 'ends with';
export type SearchHelpSign = 'positive' | 'negative';

export type ApiError = {
  error?: {
    message?: string;
  };
};

export type AxiosApiError = AxiosError<ApiError>;
