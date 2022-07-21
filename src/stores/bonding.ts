import create from 'zustand';
import { getBonding } from '../common/pngfi-api';
import { IBondingInfoWithInitSupply, toBondingInfo } from '../helpers/format';

type BondingStore = {
  bondingList: IBondingInfoWithInitSupply[];
  resetBondingList: () => void;
  fetchBondingList: () => void;
};

/**
 * bonding store
 *
 * @example
 * ```ts
 * const {
 *   bondingList,
 *   resetBondingList,
 *   fetchBondingList
 * } = useBondingStore();
 * ```
 */
export const useBondingStore = create(
  (set: any): BondingStore => ({
    bondingList: [],
    fetchBondingList: async () => {
      const { data = [] } = await getBonding();
      const bondingList = data.map((item: any) => toBondingInfo(item));

      set({ bondingList });
    },
    resetBondingList: () => {
      set({ userVestingInfo: [] });
    },
  }),
);
