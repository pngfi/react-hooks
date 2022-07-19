import fetcher from './fetcher';

const baseApi = `https://api.bunnyducky.com`;

export const merkleDistributorsApi = (owner: string) =>
  `${baseApi}/api/v1/merkleDistributors/${owner}`;
/**
 * bunnyducky merkleDistributors API
 */
export const merkleDistributors = async (owner: string) => {
  return await fetcher(merkleDistributorsApi(owner));
};

export const merkleRewardsDistributorsApi = (owner: string) =>
  `${baseApi}/api/v1/merkleRewards/distributor/${owner}`;

/**
 * bunnyducky merkleRewardsDistributors API
 */
export const merkleRewardsDistributors = async (owner: string) => {
  return await fetcher(merkleRewardsDistributorsApi(owner));
};
