import { u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

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

export type IPoolToken = ITokenInfo & {
  addr: PublicKey;
  amount: u64;
}

export declare type IToken = ITokenInfo
