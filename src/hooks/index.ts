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
} from "../common/pngfi-api";
import {
  MerkleRewardsDistributor, IResponse, IRewards,
  IMarket, IPoolInfo, IBondingInfo, IStakingInfo
} from "../types";
import { usePngfiConfig } from "./usePngfiConfig";

export const useBonding = (): IResponse<IBondingInfo[]> => useFetcher(bondingApi);

export const useStaking = (): IResponse<IStakingInfo[]> => useFetcher(stakingApi);

export const usePools = (): IResponse<IPoolInfo[]> => useFetcher(poolsApi);

export const useMarkets = (): IResponse<IMarket[]> => useFetcher(marketsApi);

export const usePrices = (ids: string[]): IResponse<Record<string, number>[]> => useFetcher(pricesApi(ids));

export const useBalances = (user: string | null) => useFetcher(balancesApi(user));

export const useUserVesting = (owner: string, vestConfig: string) =>
  useFetcher(userVestingApi(owner, vestConfig));

export const useDistributorEpochs = (distributor: string): IResponse<string[]> =>
  useFetcher(distributorEpochsApi(distributor));

export const useMerkleRewardsDistributor = (distributor: string): IResponse<MerkleRewardsDistributor> =>
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