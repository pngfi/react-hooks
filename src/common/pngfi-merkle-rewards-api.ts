import fetcher from './fetcher';
import { baseApi } from './base';
import { IMerkleRewardsInsertRequest } from '../types/distributor';

// List Distributors of User
// GET /distributors/:user
export const distributorsApi = (user: string) => user ? `${baseApi()}/distributors/${user}` : null;
export const getDistributors = async (user: string) => {
  return await fetcher(distributorsApi(user))
}

// List Distributor Epochs
// GET /:distributor/epochs
export const distributorEpochsApi = (distributor: string) => distributor ? `${baseApi()}/${distributor}/epochs` : null;
export const getDistributorEpochs = async (distributor: string) => {
  return await fetcher(distributorEpochsApi(distributor))
}

// List Rewards of Distributor
// GET /merkleRewards/:distributor
export const merkleRewardsDistributorApi = (distributor: string) => distributor ? `${baseApi()}/merkleRewards/${distributor}` : null;
export const getMerkleRewardsDistributor = async (distributor: string) => {
  return await fetcher(merkleRewardsDistributorApi(distributor))
}

// List User Rewards 
// GET /merkleRewards/:user
export const merkleRewardsApi = (user: string) => user ? `${baseApi()}/merkleRewards/${user}` : null;
export const getMerkleRewards = async (user: string) => {
  return await fetcher(merkleRewardsApi(user))
}

// List Rewards of Distributor in Epoch
// GET /:distributor/rewards/:epoch
export const distributorRewardsEpochApi = (distributor: string, epoch: string) => distributor && epoch ? `${baseApi()}/${distributor}/rewards/${epoch}` : null;
export const getDistributorRewardsEpoch = async (distributor: string, epoch: string) => {
  return await fetcher(distributorRewardsEpochApi(distributor, epoch))
}

// Insert Distributor
// POST /merkleRewards
// https://github.com/xweb3/png-api-workers/blob/main/merkle-rewards-api.md
export const distributorMerkleRewardsApi = `${baseApi()}/merkleRewards`;
export const postDistributorMerkleRewards = async (options: IMerkleRewardsInsertRequest) => {
  return await fetcher(distributorMerkleRewardsApi, {
    method: 'POST',
    data: options
  })
}