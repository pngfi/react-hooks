import type { PublicKey as IPublicKey } from '@solana/web3.js';
import create from 'zustand';

import { getUserVesting } from '../common/pngfi-api';
import { IUserVestingInfo, toVestingInfo } from '../helpers/format';

type VestingStore = {
  userVestingInfo: {
    [key: string]: IUserVestingInfo;
  } | null;
  fetchUserVestingInfo: (userKey: IPublicKey, vestingKey: IPublicKey) => void;
  resetUserVestingInfo: () => void;
};

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

      const { data } = await getUserVesting(userKey.toBase58(), vestingKeyStr);
      if (!data) return;
      const vestingInfo = toVestingInfo(data);

      const oldInfo = get().userVestingInfo;

      set({ userVestingInfo: { ...oldInfo, [vestingKeyStr]: vestingInfo } });
    },

    resetUserVestingInfo: () => {
      set({ userVestingInfo: null });
    },
  }),
);
