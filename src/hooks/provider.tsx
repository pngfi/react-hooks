import React from "react";
import { SWRConfig } from "swr";
import { Cluster, PublicKey } from "@solana/web3.js";
import {
  BareFetcher,
  PublicConfiguration,
  Cache,
  ProviderConfiguration,
} from "swr/dist/types";
import fetcher from "../common/fetcher";
import { baseApi } from "../common/base";

export declare type IProviderOptionsValue =
  | (Partial<PublicConfiguration<any, any, BareFetcher<any>>> &
      Partial<ProviderConfiguration> & {
        provider?: ((cache: Readonly<Cache<any>>) => Cache<any>) | undefined;
      })
  | undefined;

export declare interface IXweb3Provider {
  cluster: Cluster;
  xweb3Api?: string;
  distributorApi?: string;
  rpcpoolApi?: string;
  userPublicKey?: PublicKey | undefined;
  children: React.ReactElement;
  options?: IProviderOptionsValue;
}

/**
 * global config provider for Xweb3 api
 * 
 * @param {IXweb3Provider} params
 * @returns
 *
 * @example
 * ```jsx
 * const { publicKey } = useWallet();
 * 
 * <Xweb3Provider
 *  cluster='mainnet-beta'
 *  userPublicKey={publicKey}>
 *  {children}
 * </Xweb3Provider>
 * ```
 */
export const Xweb3Provider = ({
  cluster = "mainnet-beta",
  xweb3Api,
  distributorApi,
  rpcpoolApi,
  userPublicKey,
  children,
  options = {
    fetcher,
  },
}: IXweb3Provider) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("xweb3Api", (xweb3Api || "") as string);
    window.localStorage.setItem("distributorApi", (distributorApi || "") as string);
    window.localStorage.setItem("rpcpoolApi", (rpcpoolApi || "") as string);
  }

  return (
    <SWRConfig
      value={{
        ...options,
        fallback: {
          ...(options?.fallback || {}),
          // connection,
          cluster,
          xweb3Api: xweb3Api || baseApi(cluster),
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
