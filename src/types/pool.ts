import { PublicKey } from "@solana/web3.js";
// import { u64 } from '@solana/spl-token';
import Decimal from "decimal.js";
import { ITokenInfo } from "./token"

export declare enum CurveType {
  ConstantProduct = 0,
  ConstantPrice = 1,
  Stable = 2,
  Offset = 3
}

export declare type PoolToken = ITokenInfo & {
  addr: PublicKey;
  amount: number;
};

export interface IFeeStructure {
  ownerTradeFeeDenominator: number;
  ownerTradeFeeNumerator: number;
  ownerWithdrawFeeDenominator: number;
  ownerWithdrawFeeNumerator: number;
  tradeFeeDenominator: number;
  tradeFeeNumerator: number;
}
export interface IPoolInfo {
  nonce: number;
  authority: string;
  feeAccount: string;
  curveType: CurveType;
  feeStructure: IFeeStructure;
  lpSupply: Decimal;
  poolTokenMint: string;
  poolTokenDecimals: number;
  tokenA: ITokenInfo;
  tokenB: ITokenInfo;
  pubkey: string;

  // ??
  address?: PublicKey;
  amp?: number;
}

export declare interface IPoolConfig {
  pair: string;
  addr: PublicKey;
  public?: boolean;
};

export declare type IPoolRecords = Record<string, IPoolInfo>;