import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';
import { IToken } from './token';

export declare interface ILPInfo {
  tokenAHolder: IPublicKey;
  tokenBHolder: IPublicKey;
  tokenADecimals: number;
  tokenBDecimals: number;
}
export declare interface IPayoutInfo {
  payoutAmount: u64;
  internalPrice: u64;
}
export declare interface IBondingConfig {
  address: IPublicKey;
}
export declare interface IBonding {
  initDebt?: null;
  stakingAddress?: string;
  initSupply: u64;
  onlyBonding: boolean;
  pubkey: IPublicKey;
  stakingPubkey: IPublicKey;
  payoutHolder: IPublicKey;
  bondingSupply: u64;
  depositAmount: u64;
  depositHolder: IPublicKey;
  depositHolderAmount: u64;
  depositTokenMint: IPublicKey;
  maxDebt: u64;
  maxPayoutFactor: u64;
  minPrice: u64;
  payoutTokenMint: IPublicKey;
  totalDebt: u64;
  controlVariable: number;
  decayFactor: number;
  lastDecay: number;
  vestConfigInfo: IVestConfigInfo;
}

export type IBondingInfoWithTokens = IBonding & {
  originMint?: string;
  depositToken: IToken;
  depositTokenPrice: number;
  payoutToken: IToken;
  bondingPrice: number;
  payoutTokenPrice: number;
  roi: number;
  vestTerm: number;
  onlyBonding: boolean;
};

export declare interface IVestConfigInfo {
  pubkey: IPublicKey;
  vestMint: IPublicKey;
  claimAllDuration: number;
  halfLifeDuration: number;
  claimableHolder: IPublicKey;
  claimableMint: IPublicKey;
}
