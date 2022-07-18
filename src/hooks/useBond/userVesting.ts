import create from "zustand";
import { PublicKey } from "@solana/web3.js";
import { DecimalUtil } from "../../helpers/decimal";
import { getUserVesting } from "../../common/pngfi-api";
import { u64 } from "@solana/spl-token";

export declare type IRespngseUserVestingInfo = {
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
  pubkey: PublicKey;
  claimableAmount: u64;
  lastUpdatedTime: u64;
  lastVestTime: u64;
  owner: PublicKey;
  vestConfig: PublicKey;
  vestedHolder: PublicKey;
  vestedHolderAmount: u64;
};

type VestingStore = {
  userVestingInfo: IUserVestingInfo | null;
  fetchUserVestingInfo: (userKey: PublicKey, vestingKey: PublicKey) => void;
  resetUserVestingInfo: () => void;
};

function toVestingInfo(item: IRespngseUserVestingInfo) {
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
      DecimalUtil.fromString(vestedHolderAmount)
    ),
  };
}

/**
 * vesting store
 * 
 * @example
 * ```ts
 * const {
 *   userVestingInfo,
 *   resetUserVestingInfo,
 *   fetchUserVestingInfo
 * } = useUserVestingStore();
 * ```
 */
export const useUserVestingStore = create(
  (set: any, get: any): VestingStore => ({
    userVestingInfo: null,

    fetchUserVestingInfo: async (userKey, vestingKey) => {
      const vestingKeyStr = vestingKey.toString();

      const res = await getUserVesting(userKey.toBase58(), vestingKeyStr);
      const vestingInfo = toVestingInfo(res.data);

      const oldInfo = get().userVestingInfo;

      set({ userVestingInfo: { ...oldInfo, [vestingKeyStr]: vestingInfo } });
    },

    resetUserVestingInfo: () => {
      set({ userVestingInfo: null });
    },
  })
);
