import { IApiCluster } from "../types";

export const apiUrl = {
  'mainnet-beta': 'https://api.png.fi',
  'staging': 'https://api-staging.png.fi',
  'testnet': 'https://test-staging.png.fi',
  'devnet': 'https://test-staging.png.fi',
}

/**
 * pngfi base api
 */
export const baseApi = (key: IApiCluster = 'mainnet-beta') => {
  const pngfiApi = typeof window !== 'undefined' ? window.localStorage.getItem('pngfiApi') : null
  return pngfiApi || apiUrl[key];
}

/**
 * solana jsonrpc api
 */
export const rpcpoolApi = () => {
  const api = typeof window !== 'undefined' ? window.localStorage.getItem('rpcpoolApi') : null
  return api || 'https://penguin.rpcpool.com/';
}


/**
 * merkle distributor api
 */
export const distributorApi = () => {
  const api = typeof window !== 'undefined' ? window.localStorage.getItem('distributorApi') : null
  return api || 'https://api.bunnyducky.com';
}