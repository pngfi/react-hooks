import create from 'zustand';

import { getStaking } from '../common/pngfi-api';
import { toStakingInfo } from '../helpers/format';
import { IStaking } from '../types';

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
      const { data = [] } = await getStaking();
      const stakingList = data.map((item: any) => toStakingInfo(item));

      if (stakingList.length) {
        set({ stakingList });
      }
    },
  }),
);
