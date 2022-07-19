import create from 'zustand';
import { IStaking } from '../types';
import { getStaking } from '../common/pngfi-api';
import { toStakingInfo } from '../helpers/format';

type StakingStore = {
  stakingList: IStaking[];
  fetchStakingList: () => void;
};

/**
 * staking store
 *
 * @example
 * ```ts
 * const {
 *   stakingList,
 *   fetchStakingList
 * } = useStakingStore();
 * ```
 */
export const useStakingStore = create(
  (set: any): StakingStore => ({
    stakingList: [],
    fetchStakingList: async () => {
      const res = await getStaking();
      const data = res.data ?? [];
      const stakingList = data.map((item: any) => toStakingInfo(item));

      if (stakingList.length) {
        set({ stakingList });
      }
    },
  }),
);
