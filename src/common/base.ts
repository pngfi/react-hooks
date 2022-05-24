import { IApiCluster } from "../types";

export const apiUrl = {
  'mainnet-beta': 'https://api.png.fi',
  'staging': 'https://api-staging.png.fi',
  'testnet': 'https://test-staging.png.fi',
  'devnet': 'https://test-staging.png.fi',
}

/**
 * xweb3 base api
 */
export const baseApi = (key: IApiCluster = 'mainnet-beta') => {
  const xweb3Api = typeof window !== 'undefined' ? window.localStorage.getItem('xweb3Api') : null
  return xweb3Api || apiUrl[key];
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