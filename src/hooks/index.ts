import { PublicKey } from "@solana/web3.js";
import { useFetcher } from "../common/fetcher";

import {
  balancesApi,
  bondingApi,
  marketsApi,
  poolsApi,
  pricesApi,
  stakingApi,
  userVestingApi,
  distributorEpochsApi,
  merkleRewardsDistributorApi,
  distributorRewardsEpochApi,
  priceApi,
} from "../common/pngfi-api";
import {
  IMerkleRewardsDistributor, IResponse, IRewards,
  IMarket, IPool, IBonding, IStaking
} from "../types";
import { usePngfiConfig } from "./usePngfiConfig";

export const useBonding = (): IResponse<IBonding[]> => useFetcher(bondingApi);

export const useStaking = (): IResponse<IStaking[]> => useFetcher(stakingApi);

export const usePools = (): IResponse<IPool[]> => useFetcher(poolsApi);

export const useMarkets = (): IResponse<IMarket[]> => useFetcher(marketsApi);

export const usePrices = (symbols: string[]): IResponse<Record<string, number>[]> => useFetcher(pricesApi(symbols));

/**
 * Request multiple interfaces API and return a fast and stable price.
 * 
 * @example
 * ```typescript
 * const price = usePrice('SOL');
 * ```
 */
export const usePrice = (symbol: string): IResponse<string> => useFetcher(priceApi(symbol));

export const useBalances = (user: string | null) => useFetcher(balancesApi(user));

export const useUserVesting = (owner: string, vestConfig: string) =>
  useFetcher(userVestingApi(owner, vestConfig));

export const useDistributorEpochs = (distributor: string): IResponse<string[]> =>
  useFetcher(distributorEpochsApi(distributor));

export const useMerkleRewardsDistributor = (distributor: string): IResponse<IMerkleRewardsDistributor> =>
  useFetcher(merkleRewardsDistributorApi(distributor));

export const useDistributorRewardsEpoch = (
  distributor: string,
  epoch: string
): IResponse<IRewards[]> => useFetcher(distributorRewardsEpochApi(distributor, epoch));

/**
 * get userPublicKey of PngfiProvider config
 * 
 * @returns {PublicKey} userPublicKey
 * 
 * @example
 * ```typescript
 * const userPublicKey = useUserPublicKey();
 * ```
 */
export const useUserPublicKey = (): PublicKey => {
  const { fallback: { userPublicKey } } = usePngfiConfig();
  return userPublicKey
}