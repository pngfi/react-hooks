import { useFetcher } from '../../common/fetcher';
import {
  distributorsApi,
  merkleRewardsApi,
} from '../../common/pngfi-merkle-rewards-api';
import {
  IDistributorResponse,
  IMerkleRewardsResponse,
} from '../../types/distributor';
import { IResponse } from '../../types/response';

/**
 * List of distributor rewards
 *
 * @param options
 * @returns IResponse<IMerkleRewardsResponse>
 *
 * @example
 * ```typescript
 * const { data, loading, error } = useMerkleRewards(publicKey.toString());
 * ```
 */
export const useMerkleRewards = (
  user: string,
): IResponse<IMerkleRewardsResponse[]> => useFetcher(merkleRewardsApi(user));

/**
 * List of distributors
 *
 * @param options
 * @returns IResponse<IDistributorResponse>
 *
 * @example
 * ```typescript
 * const { data, loading, error } = useDistributors(publicKey.toString());
 * ```
 */
export const useDistributors = (
  user: string,
): IResponse<IDistributorResponse[]> => useFetcher(distributorsApi(user));
