import { AxiosResponse, AxiosRequestConfig } from 'axios';

// Re-export AxiosResponse para compatibilidad
export type { AxiosResponse } from 'axios';

// Define AxiosPromise para compatibilidad con código generado por OpenAPI
export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

// Define AxiosInstance como any para compatibilidad máxima
export type AxiosInstance = any;

// Define RawAxiosRequestConfig para compatibilidad con código generado por OpenAPI
export type RawAxiosRequestConfig = AxiosRequestConfig; 