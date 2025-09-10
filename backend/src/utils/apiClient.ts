// src/utils/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { externalApiConfig } from "../config/externalAPI";

const client: AxiosInstance = axios.create({
  baseURL: externalApiConfig.baseURL,
  timeout: externalApiConfig.timeoutMs,
  headers: {
    "Accept": "application/json",
    ...(externalApiConfig.apiKey ? { "X-API-Key": externalApiConfig.apiKey } : {}),
  },
});

client.interceptors.request.use((config) => {
  return config;
});

client.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const config = error.config as AxiosRequestConfig & { __retryCount?: number };
    const status = error?.response?.status;

    const shouldRetry = (!status || (status >= 500 && status < 600)) && (config.__retryCount ?? 0) < 1;
    if (shouldRetry) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      return client(config);
    }
    return Promise.reject(error);
  }
);

export { client };
