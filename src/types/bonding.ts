import type { u64 as Iu64 } from '@solana/spl-token';
import type { PublicKey as IPublicKey } from '@solana/web3.js';

import { IToken } from './token';

export declare interface ILPInfo {
  tokenAHolder: IPublicKey;
  tokenBHolder: IPublicKey;
  tokenADecimals: number;
  tokenBDecimals: number;
}
export declare interface IPayoutInfo {
  payoutAmount: Iu64;
  internalPrice: Iu64;
}
export declare interface IBondingConfig {
  address: IPublicKey;
}
export declare interface IBonding {
  initDebt?: null;
  stakingAddress?: string;
  initSupply: Iu64;
  onlyBonding: boolean;
  pubkey: IPublicKey;
  stakingPubkey: IPublicKey;
  payoutHolder: IPublicKey;
  bondingSupply: Iu64;
  depositAmount: Iu64;
  depositHolder: IPublicKey;
  depositHolderAmount: Iu64;
  depositTokenMint: IPublicKey;
  maxDebt: Iu64;
  maxPayoutFactor: Iu64;
  minPrice: Iu64;
  payoutTokenMint: IPublicKey;
  totalDebt: Iu64;
  controlVariable: number;
  decayFactor: number;
  lastDecay: number;
  vestConfigInfo: IVestConfigInfo;

  originMint?: string;
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
