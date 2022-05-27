import { useFetcher } from '../../common/fetcher';
import { pricesApi, tokensApi } from '../../common/pngfi-api';
import { IResponse } from '../../types';
import { ITokenInfo } from '../../types/token';

export const useTokens = (): IResponse<ITokenInfo[]> => useFetcher(tokensApi);

export const useTokensPriceByMints = (mints: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  const mintTokens = data.filter((v: ITokenInfo) => mints.includes(v.mint));
  return useFetcher(pricesApi(mintTokens.map((v: { symbol: string; }) => v.symbol)))
};

export const useTokensPriceBySymbols = (symbols: string[]) => {
  return useFetcher(pricesApi(symbols))
};

export const useTokensByMints = (mints: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((v: ITokenInfo) => mints.includes(v.mint));
};

export const useTokensBySymbols = (symbols: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((v: ITokenInfo) => symbols.includes(v.symbol));
};

export const useTokenByMint = (mint: string) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((v: ITokenInfo) => v.mint === mint);
};

export const useTokenBySymbol = (symbol: string) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((v: ITokenInfo) => v.symbol === symbol);
}

export const useTokenByDefault = (filter: Record<keyof ITokenInfo, any>) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((val: ITokenInfo) => Object.keys(filter).map(v => filter[v] !== val[v]).every(v => v))[0];
} 

export const useToken = (filter: Record<keyof ITokenInfo, any>) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((val: ITokenInfo) => Object.keys(filter).map(v => filter[v] === val[v]).every(v => v));
}
