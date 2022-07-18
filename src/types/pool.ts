import { PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";
import { IPoolToken, ITokenInfo } from "./token"

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
  address: PublicKey;
  nonce: number;
  authority: PublicKey;
  poolTokenMint: PublicKey;
  poolTokenDecimals: number;
  feeAccount: PublicKey;
  curveType: CurveType;
  feeStructure: IFeeStructure;
  tokenA: IPoolToken;
  tokenB: IPoolToken;
  lpSupply: Decimal;
  amp?: number;
  pubkey: string;
}

export declare interface IPoolConfig {
  pair: string;
  addr: PublicKey;
  public?: boolean;
};

export declare type IPoolRecords = Record<string, IPoolInfo>;