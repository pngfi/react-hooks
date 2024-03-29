import { baseApi } from './base';
import fetcher from './fetcher';

export * from './pngfi-merkle-rewards-api';

export const tokensApi = `${baseApi()}/tokens`;
export const getTokens = async () => {
  return await fetcher(tokensApi);
};

export const poolsApi = `${baseApi()}/pools`;
export const getPools = async () => {
  return await fetcher(poolsApi);
};

export const marketsApi = `${baseApi()}/markets`;
export const getMarkets = async () => {
  return await fetcher(marketsApi);
};

export const pricesApi = (symbols: string[] = []) =>
  `${baseApi()}/prices/${symbols.join(',')}`;
export const getPrices = async (symbols?: string[]) => {
  return await fetcher(pricesApi(symbols || []));
};

export const priceApi = (symbol: string) =>
  symbol ? `${baseApi()}/price/${symbol}` : null;
export const getPrice = async (symbol: string) => {
  return await fetcher(priceApi(symbol));
};

export const bondingApi = `${baseApi()}/bonding`;
export const getBonding = async () => {
  return await fetcher(bondingApi);
};

export const stakingApi = `${baseApi()}/staking`;
export const getStaking = async () => {
  return await fetcher(stakingApi);
};

export const balancesApi = (user: string | null) =>
  user ? `${baseApi()}/balances/${user}` : null;
export const getBalances = async (user: string) => {
  return user ? await fetcher(balancesApi(user)) : null;
};

export const userVestingApi = (owner: string, vestConfig: string) =>
  owner && vestConfig
    ? `${baseApi()}/user-vesting/${owner}/${vestConfig}`
    : null;
export const getUserVesting = async (owner: string, vestConfig: string) => {
  return owner ? await fetcher(userVestingApi(owner, vestConfig)) : null;
};
