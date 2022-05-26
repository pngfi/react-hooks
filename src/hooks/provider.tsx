import React from "react";
import { SWRConfig } from "swr";
import { Cluster, PublicKey } from "@solana/web3.js";
// import { Wallet } from "@solana/wallet-adapter-react";
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

export declare interface IPngfiProvider {
  // connection: Connection;
  // wallet: Wallet;
  cluster: Cluster;
  pngfiApi?: string;
  distributorApi?: string;
  rpcpoolApi?: string;
  userPublicKey?: PublicKey | undefined;
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
 *  cluster='mainnet-beta'
 *  userPublicKey={wallet.publicKey}>
 *  {children}
 * </PngfiProvider>
 * ```
 */
export const PngfiProvider = ({
  // connection,
  // wallet,
  cluster = "mainnet-beta",
  pngfiApi,
  distributorApi,
  rpcpoolApi,
  userPublicKey,
  children,
  options = {
    fetcher,
  },
}: IPngfiProvider) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("pngfiApi", (pngfiApi || "") as string);
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
          // wallet,
          cluster,
          pngfiApi: pngfiApi || baseApi(cluster),
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
