import axios, { AxiosRequestConfig } from 'axios';
import useSWR from 'swr';

import { appId, baseApi } from './base';

export enum EHttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export default async function fetcher(
  url: string | null | undefined,
  options: AxiosRequestConfig<any> = {
    method: 'GET',
  },
): Promise<any> {
  url = url ? (/^http/.test(url) ? url : `${baseApi()}${url}`) : '';
  const res = await axios(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-API-Key': appId() || '',
    },
  });
  return res.data;
}

export function useFetcher(
  url: string | null,
  options?: AxiosRequestConfig<any>,
) {
  const { data, error } = useSWR(url, (url) => fetcher(url, options));

  return {
    data,
    loading: !error && !data,
    error,
  };
}
