export declare interface IExtensions {
  assetContract?: string;
  bridgeContract?: string;
  telegram?: string;
  discord?: string;
  twitter?: string;
  website?: string;
  description?: string;
  coingeckoId?: string;
}

export declare type ITokenInfo = {
  chainId?: number;
  decimals: number | undefined;
  logoURI: string;
  mint: string;
  name: string;
  symbol: string;
  tags?: string[];
  extensions?: IExtensions;
  price?: number;

  fetchPrice?: boolean;
  isLP?: boolean;
  display?: boolean;
}
