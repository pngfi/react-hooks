import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';
import { DecimalUtil } from '../decimal';

export declare type IResponseUserVestingInfo = {
  pubkey: string;
  claimableAmount: string;
  lastUpdatedTime: string;
  lastVestTime: string;
  owner: string;
  vestConfig: string;
  vestedHolder: string;
  vestedHolderAmount: string;
};

export declare type IUserVestingInfo = {
  pubkey: IPublicKey;
  claimableAmount: u64;
  lastUpdatedTime: u64;
  lastVestTime: u64;
  owner: IPublicKey;
  vestConfig: IPublicKey;
  vestedHolder: IPublicKey;
  vestedHolderAmount: u64;
};

export function toVestingInfo(item: IResponseUserVestingInfo) {
  if (!item) return;

  const {
    pubkey,
    claimableAmount,
    lastUpdatedTime,
    lastVestTime,
    // nonce
    owner,
    vestConfig,
    vestedHolder,
    vestedHolderAmount,
  } = item;

  return {
    pubkey: new PublicKey(pubkey),
    claimableAmount: DecimalUtil.toU64(DecimalUtil.fromString(claimableAmount)),
    lastUpdatedTime: DecimalUtil.toU64(DecimalUtil.fromString(lastUpdatedTime)),
    lastVestTime: DecimalUtil.toU64(DecimalUtil.fromString(lastVestTime)),
    owner: new PublicKey(owner),
    vestConfig: new PublicKey(vestConfig),
    vestedHolder: new PublicKey(vestedHolder),
    vestedHolderAmount: DecimalUtil.toU64(
      DecimalUtil.fromString(vestedHolderAmount),
    ),
  };
}
