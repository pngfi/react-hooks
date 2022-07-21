import create from 'zustand';
import { IPool } from '../types';
import { getPools } from '../common/pngfi-api';
import { toPoolInfo } from '../helpers/format';

type PoolStore = {
  pools: Record<string, IPool>;
  updatePools: (pools: Record<string, IPool>) => void;
  fetchPoolList: () => void;
};

/**
 * pool store
 *
 * @example
 * ```ts
 * const {
 *   pools,
 *   updatePools,
 *   fetchPoolList
 * } = usePoolStore();
 * ```
 */
export const usePoolStore = create(
  (set: any): PoolStore => ({
    pools: {},
    updatePools: (pools: Record<string, IPool>) => {
      set({ pools });
    },
    fetchPoolList: async () => {
      const { data = [] } = await getPools();
      const poolsInfo = data.map((item: any) => toPoolInfo(item));

      const pools = poolsInfo.reduce(
        (
          record: { [x: string]: any },
          item: { tokenA: { symbol: any }; tokenB: { symbol: any } },
        ) => {
          const pair = `${item?.tokenA.symbol}_${item?.tokenB.symbol}`;

          record[pair] = item;
          return record;
        },
        {},
      );

      if (Object.keys(pools).length) {
        set({ pools });
      }
    },
  }),
);
