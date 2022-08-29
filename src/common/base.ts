export const apiUrl = {
  // 'mainnet-beta': 'https://api.png.fi',
  // staging: 'https://api-staging.png.fi',
  // testnet: 'https://test-staging.png.fi',
  // devnet: 'https://test-staging.png.fi',
  'mainnet-beta': 'https://chain.png.fi/api',
  staging: 'https://chain.png.fi/api-staging',
  testnet: 'https://chain.png.fi/api-testing',
  devnet: 'https://chain.png.fi/api-testing',
};

/**
 * pngfi base api
 */
export const baseApi = () => {
  const key =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cluster') || 'mainnet-beta'
      : 'mainnet-beta';
  const pngfiApi =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('pngfiApi')
      : null;
  return pngfiApi || apiUrl[key];
};

/**
 * solana jsonrpc api
 */
export const rpcpoolApi = () => {
  const key =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cluster') || 'mainnet-beta'
      : 'mainnet-beta';
  const api =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('rpcpoolApi')
      : null;
  return api || `${apiUrl[key]}/rpc`; //'https://penguin.rpcpool.com/';
};

/**
 * merkle distributor api
 */
export const distributorApi = () => {
  const api =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('distributorApi')
      : null;
  return api || 'https://api.bunnyducky.com';
};

/**
 * Appid provided by pngfi
 */
export const appId = () => {
  return typeof window !== 'undefined'
    ? window.localStorage.getItem('appId')
    : '';
};
