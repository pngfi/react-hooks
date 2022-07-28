import { PublicKey } from '@solana/web3.js';
import { DecimalUtil } from '../decimal';

export type IResponseStakingInfo = {
  pubkey: string;
  tokenMint: string;
  sTokenMint: string;
  tokenHolder: string;
  tokenHolderAmount: string;
  rebaseEpochDuration: number;
  rebaseLastTime: number;
  rebaseRateNumerator: number;
  rebaseRateDenominator: number;
  rebaseRewardsAmount: string;
  rewardsHolder: string;
  rebaseSupply: string;
  apy: number;
  rewardsPerDay: string;
  sTokenMintSupply: string;
  vestConfigInfo: {
    [key: string]: any;
  };
};

export function toStakingInfo(item: IResponseStakingInfo) {
  const {
    pubkey,
    tokenMint,
    sTokenMint,
    tokenHolder,
    tokenHolderAmount,
    rebaseEpochDuration,
    rebaseLastTime,
    rebaseRateNumerator,
    rebaseRateDenominator,
    rebaseRewardsAmount,
    rewardsHolder,
    rebaseSupply,
    apy,
    rewardsPerDay,
    sTokenMintSupply,
    vestConfigInfo = {},
  } = item;

  return {
    pubkey: new PublicKey(pubkey),
    tokenMint: new PublicKey(tokenMint),
    sTokenMint: new PublicKey(sTokenMint),
    tokenHolder: new PublicKey(tokenHolder),
    payoutTokenMint: new PublicKey(
      'BUD1144GGYwmMRFs4Whjfkom5UHqC9a8dZHPVvR2vfPx',
    ),
    tokenHolderAmount: DecimalUtil.toU64(
      DecimalUtil.fromString(tokenHolderAmount || '0'),
    ),
    rebaseEpochDuration,
    rebaseLastTime,
    apy,
    rewardsPerDay,
    rebaseRateNumerator,
    rebaseRateDenominator,
    rewardsHolder: new PublicKey(rewardsHolder),
    rebaseSupply: DecimalUtil.toU64(
      DecimalUtil.fromString(rebaseSupply || '0'),
    ),
    sTokenMintSupply: DecimalUtil.toU64(
      DecimalUtil.fromString(sTokenMintSupply || '0'),
    ),
    rebaseRewardsAmount: DecimalUtil.toU64(
      DecimalUtil.fromString(rebaseRewardsAmount || '0'),
    ),
    vestConfigInfo: {
      pubkey: new PublicKey(vestConfigInfo.pubkey),
      vestMint: new PublicKey(vestConfigInfo.vestMint),
      claimAllDuration: vestConfigInfo.claimAllDuration,
      halfLifeDuration: vestConfigInfo.halfLifeDuration,
      claimableHolder: new PublicKey(vestConfigInfo.claimableHolder),
      claimableMint: new PublicKey(vestConfigInfo.claimableMint),
    },
  };
}
