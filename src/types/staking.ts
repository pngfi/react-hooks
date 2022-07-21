import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';

export declare interface IStakingConfig {
  address: IPublicKey;
  vestConfig: IPublicKey;
}
export declare interface IStaking {
  pubkey: IPublicKey;
  tokenMint: IPublicKey;
  sTokenMint: IPublicKey;
  tokenHolder: IPublicKey;
  payoutTokenMint: IPublicKey;
  tokenHolderAmount: u64;
  rebaseEpochDuration: number;
  rebaseLastTime: number;
  rebaseRateNumerator: number;
  rebaseRateDenominator: number;
  rewardsHolder: IPublicKey;
  apy: number;
  rewardsPerDay: string;
  rebaseSupply: u64;
  sTokenMintSupply: u64;
  rebaseRewardsAmount: u64;
  vestConfigInfo: IVestConfig;
}

declare interface IVestConfig {
  pubkey: IPublicKey;
  vestMint: IPublicKey;
  claimAllDuration: number;
  halfLifeDuration: number;
  claimableHolder: IPublicKey;
  claimableMint: IPublicKey;
}
