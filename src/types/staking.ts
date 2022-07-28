import type { PublicKey as IPublicKey } from '@solana/web3.js';
import type { u64 as Iu64 } from '@solana/spl-token';

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
  tokenHolderAmount: Iu64;
  rebaseEpochDuration: number;
  rebaseLastTime: number;
  rebaseRateNumerator: number;
  rebaseRateDenominator: number;
  rewardsHolder: IPublicKey;
  apy: number;
  rewardsPerDay: string;
  rebaseSupply: Iu64;
  sTokenMintSupply: Iu64;
  rebaseRewardsAmount: Iu64;
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
