import { AxiosRequestHeaders } from 'axios';

import {
  IDistributorConfirm,
  IMerkleRewardsInsertRequest,
} from '../types/distributor';
import { baseApi } from './base';
import fetcher from './fetcher';

// List Distributors of User
// GET /distributors/:user
export const distributorsApi = (user: string) =>
  user ? `${baseApi()}/distributors/${user}` : null;
export const getDistributors = async (user: string) => {
  return await fetcher(distributorsApi(user));
};

// List Distributor Epochs
// GET /:distributor/epochs
export const distributorEpochsApi = (distributor: string) =>
  distributor ? `${baseApi()}/${distributor}/epochs` : null;
export const getDistributorEpochs = async (distributor: string) => {
  return await fetcher(distributorEpochsApi(distributor));
};

// Distributor info
// GET /:distributor/info
export const distributorInfoApi = (distributor: string) =>
  distributor ? `${baseApi()}/${distributor}/info` : null;
export const getDistributorInfo = async (distributor: string) => {
  return await fetcher(distributorInfoApi(distributor));
};

// List Rewards of Distributor
// GET /merkleRewards/:distributor
export const merkleRewardsDistributorApi = (distributor: string) =>
  distributor ? `${baseApi()}/merkleRewards/${distributor}` : null;
export const getMerkleRewardsDistributor = async (distributor: string) => {
  return await fetcher(merkleRewardsDistributorApi(distributor));
};

// List User Rewards
// GET /merkleRewards/:user
export const merkleRewardsApi = (user: string) =>
  user ? `${baseApi()}/merkleRewards/${user}` : null;
export const getMerkleRewards = async (user: string) => {
  return await fetcher(merkleRewardsApi(user));
};

// List Rewards of Distributor in Epoch
// GET /:distributor/rewards/:epoch
export const distributorRewardsEpochApi = (
  distributor: string,
  epoch: string,
) =>
  distributor && epoch ? `${baseApi()}/${distributor}/rewards/${epoch}` : null;
export const getDistributorRewardsEpoch = async (
  distributor: string,
  epoch: string,
) => {
  return await fetcher(distributorRewardsEpochApi(distributor, epoch));
};

// Reture reward by distributor and user
// GET /:distributor/:user
export const amountsForUserApi = (distributor: string, user: string) =>
  distributor && user ? `${baseApi()}/${distributor}/user/${user}` : null;
export const getAmountsForUser = async (
  distributor: string,
  user: string,
): Promise<string> => {
  const result = await fetcher(amountsForUserApi(distributor, user));
  return result?.amount;
};

// Insert Distributor
// POST /merkleRewards
// https://github.com/pngfi/png-api-workers/blob/main/merkle-rewards-api.md
export const distributorMerkleRewardsApi = `${baseApi()}/merkleRewards`;
export const postDistributorMerkleRewards = async (
  options: IMerkleRewardsInsertRequest,
) => {
  return await fetcher(distributorMerkleRewardsApi, {
    method: 'POST',
    data: options,
  });
};

// Confirm Distributor
// POST /distributor/confirm
export const confirmDistributorApi = `${baseApi()}/distributor/confirm`;
export const postConfirmDistributor = async (
  options: IDistributorConfirm,
  headers: AxiosRequestHeaders,
) => {
  return await fetcher(confirmDistributorApi, {
    method: 'POST',
    data: options,
    headers,
  });
};

// Delete Distributor
// DELETE /distributor/confirm
export const deleteDistributorApi = (address: string) =>
  `${baseApi()}/distributor/reward/${address}`;
export const deleteDistributor = async (
  address: string,
  headers: AxiosRequestHeaders,
) => {
  return await fetcher(deleteDistributorApi(address), {
    method: 'DELETE',
    headers,
  });
};
