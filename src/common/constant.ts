import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { Cluster, PublicKey } from '@solana/web3.js';

/* eslint-disable @typescript-eslint/no-var-requires */
import { IFeeStructure } from '../types';

const { u64 } = require('@solana/spl-token');

export const solanaCluster = (): Cluster => {
  const cluster =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cluster')
      : 'mainnet-beta';
  return cluster as Cluster;
};

export const SOLANA_COMMITMENT = 'processed';

export const ZERO_U64 = new u64(0);
export const ONE_U64 = new u64(1);
export const ONE_HUNDRED_U64 = new u64(100);
export const ONE_THOUSAND_U64 = new u64(1000);

export const SOL_TOKEN_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112',
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  '11111111111111111111111111111111',
);

export const PNG_TOKEN_SWAP_ID: IPublicKey = new PublicKey(
  'PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP',
);

export const PNG_BONDING_ID: IPublicKey = new PublicKey(
  'PBondDFu4LkX2iw1ozEvdhxv5CtmY7mzLRa8t8D75di',
);
export const PNG_VESTING_ID: IPublicKey = new PublicKey(
  'VESTZzwXWQ4MSjUZSUEg1Kb7rxsrYjHCrenA6pHpGxL',
);
export const PNG_STAKING_ID: IPublicKey = new PublicKey(
  'PStakuQi71BkHTyPor8EF6ooAvNLpqc4cYGNjGpLrtY',
);
export const BUD_REWARD_ID: IPublicKey = new PublicKey(
  'PMRKTWvK9f1cPkQuXvvyDPmyCSoq8FdedCimXrXJp8M',
);

export const PNG_TOKEN_SWAP_FEE_ACCOUNT_OWNER = new PublicKey(
  '3M1gJoNCxuw6GBMRatHzCvxwbQMiUZ6VoG22UCjubQZq',
);

export const PNG_TOKEN_SWAP_FEE_STRUCTURE: IFeeStructure = {
  tradeFeeNumerator: 25,
  tradeFeeDenominator: 10000,
  ownerTradeFeeNumerator: 5,
  ownerTradeFeeDenominator: 10000,
  ownerWithdrawFeeNumerator: 0,
  ownerWithdrawFeeDenominator: 0,
};
