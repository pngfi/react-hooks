import type { PublicKey as IPublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { u64 } from '@solana/spl-token';
import { IToken } from './token';

export enum CurveType {
  ConstantProduct = 0,
  ConstantPrice = 1,
  Stable = 2,
  Offset = 3,
}

export declare type IPoolToken = IToken & {
  addr: IPublicKey;
  amount: u64;
};

export declare type IPoolTokenResponse = IToken & {
  addr: string;
  amount: string;
};

export interface IFeeStructure {
  ownerTradeFeeDenominator: number;
  ownerTradeFeeNumerator: number;
  ownerWithdrawFeeDenominator: number;
  ownerWithdrawFeeNumerator: number;
  tradeFeeDenominator: number;
  tradeFeeNumerator: number;
}
export interface IPool {
  address: IPublicKey;
  nonce: number;
  authority: IPublicKey;
  poolTokenMint: IPublicKey;
  poolTokenDecimals: number;
  feeAccount: IPublicKey;
  curveType: CurveType;
  feeStructure: IFeeStructure;
  tokenA: IPoolToken;
  tokenB: IPoolToken;
  lpSupply: Decimal;
  amp?: number;

  pubkey?: string;
}

export declare interface IPoolConfig {
  pair: string;
  addr: IPublicKey;
  public?: boolean;
}

export declare type IPoolRecords = Record<string, IPool>;
