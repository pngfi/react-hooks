import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { Cluster } from '@solana/web3.js';
import React from 'react';
import { SWRConfig } from 'swr';
import {
  BareFetcher,
  Cache,
  ProviderConfiguration,
  PublicConfiguration,
} from 'swr/dist/types';

import { baseApi } from '../common/base';
import fetcher from '../common/fetcher';

export declare type IProviderOptionsValue =
  | (Partial<PublicConfiguration<any, any, BareFetcher<any>>> &
      Partial<ProviderConfiguration> & {
        provider?: ((cache: Readonly<Cache<any>>) => Cache<any>) | undefined;
      })
  | undefined;

export declare interface IPngfiProvider {
  cluster: Cluster;
  appId?: string;
  pngfiApi?: string;
  distributorApi?: string;
  rpcpoolApi?: string;
  userPublicKey?: IPublicKey | undefined;
  children: React.ReactElement;
  options?: IProviderOptionsValue;
}

/**
 * global config provider for Pngfi api
 *
 * @param {IPngfiProvider} params
 * @returns
 *
 * @example
 * ```jsx
 * const wallet = useWallet();
 *
 * <PngfiProvider
 *  appId="xkwFOD8LDi1nA2yl1Mc6F6ehone6MwsPhdHU1euAj3Mx"
 *  cluster='mainnet-beta'
 *  userPublicKey={wallet.publicKey}>
 *  {children}
 * </PngfiProvider>
 * ```
 */
export const PngfiProvider = ({
  // connection,
  // wallet,
  appId,
  cluster = 'mainnet-beta',
  pngfiApi,
  distributorApi,
  rpcpoolApi,
  userPublicKey,
  children,
  options = {
    fetcher,
  },
}: IPngfiProvider) => {
  if (typeof window !== 'undefined') {
    cluster && window.localStorage.setItem('cluster', cluster);
    appId && window.localStorage.setItem('appId', appId);
    pngfiApi && window.localStorage.setItem('pngfiApi', pngfiApi || '');
    distributorApi &&
      window.localStorage.setItem('distributorApi', distributorApi || '');
    rpcpoolApi && window.localStorage.setItem('rpcpoolApi', rpcpoolApi || '');
  }

  return (
    <SWRConfig
      value={{
        ...options,
        fallback: {
          ...(options?.fallback || {}),
          appId,
          cluster,
          pngfiApi: pngfiApi || baseApi(),
          distributorApi,
          rpcpoolApi,
          userPublicKey,
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
