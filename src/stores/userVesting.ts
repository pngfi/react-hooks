import create from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { getUserVesting } from '../common/pngfi-api';
import { IUserVestingInfo, toVestingInfo } from '../helpers/format';

type VestingStore = {
  userVestingInfo: IUserVestingInfo | null;
  fetchUserVestingInfo: (userKey: PublicKey, vestingKey: PublicKey) => void;
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

      const res = await getUserVesting(userKey.toBase58(), vestingKeyStr);
      const vestingInfo = toVestingInfo(res.data);

      const oldInfo = get().userVestingInfo;

      set({ userVestingInfo: { ...oldInfo, [vestingKeyStr]: vestingInfo } });
    },

    resetUserVestingInfo: () => {
      set({ userVestingInfo: null });
    },
  }),
);
