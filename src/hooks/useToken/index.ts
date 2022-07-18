import { useFetcher } from '../../common/fetcher';
import { pricesApi, tokensApi } from '../../common/pngfi-api';
import { IResponse } from '../../types';
import { IToken } from '../../types/token';

export const useTokens = (): IResponse<IToken[]> => useFetcher(tokensApi);

export const useTokensPriceByMints = (mints: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  const mintTokens = data.filter((v: IToken) => mints.includes(v.mint));
  console.log('mintTokens', mintTokens);
  return useFetcher(pricesApi(mintTokens.map((v: { symbol: string; }) => v.symbol)))
};

export const useTokensPriceBySymbols = (symbols: string[]) => {
  return useFetcher(pricesApi(symbols))
};

export const useTokensByMints = (mints: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((v: IToken) => mints.includes(v.mint));
};

export const useTokensBySymbols = (symbols: string[]) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((v: IToken) => symbols.includes(v.symbol));
};

export const useTokenByMint = (mint: string) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((v: IToken) => v.mint === mint);
};

export const useTokenBySymbol = (symbol: string) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((v: IToken) => v.symbol === symbol);
}

export const useTokenByDefault = (filter: Record<keyof IToken, any>) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.filter((val: IToken) => Object.keys(filter).map(v => filter[v] !== val[v]).every(v => v))[0];
} 

export const useToken = (filter: Record<keyof IToken, any>) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((val: IToken) => Object.keys(filter).map(v => filter[v] === val[v]).every(v => v));
}
