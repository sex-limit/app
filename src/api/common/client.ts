import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Env } from '@env';
import { getAuthToken } from '@/core';
import { getRouterStore } from '@/contexts/router/router';

export const AuthSymbol = 'AuthSymbol';

const clientImpl = axios.create({
  baseURL: Env.API_URL,
});

clientImpl.interceptors.response.use(
  (data) => data.data,
  (error: AxiosError) => {
    const needReLogin = error.response?.status === 401;

    if (needReLogin) {
      getRouterStore()?.goAuth();
    }

    console.log('request error', error.response);
    throw error;
  },
);

clientImpl.interceptors.request.use((config) => {
  const isAuthRequest = config.headers[AuthSymbol];

  if (isAuthRequest) {
    delete config.headers[AuthSymbol];
    return config;
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${getAuthToken()?.token}`,
    },
  };
});

export const client = <T>(config: AxiosRequestConfig) => {
  return clientImpl(config) as Promise<T>;
};
