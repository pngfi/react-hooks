import { useFetcher } from "../../common/fetcher";
import { distributorMerkleRewardsApi, distributorsApi, merkleRewardsApi } from "../../common/pngfi-merkle-rewards-api";
import { IMerkleDistributorItem, IMerkleRewards, IMerkleRewardsInsertRequest, IMerkleRewardsInsertResponse } from "../../types/distributor";
import { IResponse } from "../../types/response";

/**
 * List of distributor rewards
 * 
 * @param options 
 * @returns IResponse<IMerkleRewards>
 * 
 * @example
 * ```typescript
 * const { data, loading, error } = useMerkleRewards(publicKey.toString());
 * ```
 */
export const useMerkleRewards = (user: string): IResponse<IMerkleRewards> => useFetcher(merkleRewardsApi(user));


/**
 * List of distributors
 * 
 * @param options 
 * @returns IResponse<IMerkleDistributorItem>
 * 
 *
 * @example
 * ```typescript
 * const { data, loading, error } = useDistributors(publicKey.toString());
 * ```
 */
export const useDistributors = (user: string): IResponse<IMerkleDistributorItem> => useFetcher(distributorsApi(user));

/**
 * Insert distributor
 * 
 * @param options 
 * @returns IResponse<IMerkleRewardsInsertResponse>
 * 
 * 
 * @example
 * ```typescript
 * const { data, loading, error } = useInsertDistributorMerkleRewards({
 *   "title": "coinId-Airdrop-22-05-21",
 *   "base": "xxAfjgadh9yWRogsXJ1wXQBMKj36ostXMn8LpS1zQp1W",
 *   "projectID": "coinId",
 *   "epochID": 134662756,
 *   "adminAuth": "x39AvmSeyFFbxuKWJhSG53rTK9bQ69Sv9nZ8e6zCCPw1",
 *   "mint": "x6VYF5jXq6rfq4QRgGMG6co7b1Ev1Lj7KSbHBxfQ9e1L",
 *   "rewards": [{
 *     "dest": "x39AvmSeyFFbxuKWJhSG53rTK9bQ69Sv9nZ8e6zCCPw1",
 *     "amount": "10000000000000"
 *   }]
 * });
 * ```
 */
 export const useInsertDistributorMerkleRewards = (
  options: IMerkleRewardsInsertRequest
): IResponse<IMerkleRewardsInsertResponse> =>
  useFetcher(distributorMerkleRewardsApi, {
    method: 'POST',
    data: options,
  });
