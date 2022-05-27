import { useFetcher } from '../../common/fetcher';
import { tokensApi } from '../../common/pngfi-api';
import { IResponse } from '../../types';
import { ITokenInfo } from '../../types/token';

export const useTokens = (): IResponse<ITokenInfo[]> => useFetcher(tokensApi);

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
  return data.filter((val: ITokenInfo) => Object.keys(filter).map(v => filter[v] === val[v]).every(v => v))[0];
} 

export const useToken = (filter: Record<keyof ITokenInfo, any>) => {
  const { data = [] } = useFetcher(tokensApi);
  return data.find((val: ITokenInfo) => Object.keys(filter).map(v => filter[v] === val[v]).every(v => v));
}