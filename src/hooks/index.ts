import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { useFetcher } from '../common/fetcher';

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
} from '../common/pngfi-api';
import {
  IRespngseBondingInfo,
  IRespngsePoolInfo,
  IRespngseStakingInfo,
} from '../helpers/format';
import {
  IMerkleRewardsDistributor,
  IResponse,
  IRewards,
  IMarket,
} from '../types';
import { usePngfiConfig } from './usePngfiConfig';

export const useBonding = (): IResponse<IRespngseBondingInfo[]> =>
  useFetcher(bondingApi);

export const useStaking = (): IResponse<IRespngseStakingInfo[]> =>
  useFetcher(stakingApi);

export const usePools = (): IResponse<IRespngsePoolInfo[]> =>
  useFetcher(poolsApi);

export const useMarkets = (): IResponse<IMarket[]> => useFetcher(marketsApi);

export const usePrices = (
  symbols: string[],
): IResponse<Record<string, number>[]> => useFetcher(pricesApi(symbols));

/**
 * Request multiple interfaces API and return a fast and stable price.
 *
 * @example
 * ```typescript
 * const price = usePrice('SOL');
 * ```
 */
export const usePrice = (symbol: string): IResponse<string> =>
  useFetcher(priceApi(symbol));

export const useBalances = (user: string | null) =>
  useFetcher(balancesApi(user));

export const useUserVesting = (owner: string, vestConfig: string) =>
  useFetcher(userVestingApi(owner, vestConfig));

export const useDistributorEpochs = (
  distributor: string,
): IResponse<string[]> => useFetcher(distributorEpochsApi(distributor));

export const useMerkleRewardsDistributor = (
  distributor: string,
): IResponse<IMerkleRewardsDistributor> =>
  useFetcher(merkleRewardsDistributorApi(distributor));

export const useDistributorRewardsEpoch = (
  distributor: string,
  epoch: string,
): IResponse<IRewards[]> =>
  useFetcher(distributorRewardsEpochApi(distributor, epoch));

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
export const useUserPublicKey = (): IPublicKey => {
  const {
    fallback: { userPublicKey },
  } = usePngfiConfig();
  return userPublicKey;
};
