import Decimal from 'decimal.js';
import create from 'zustand';

import { getBalances } from '../common/pngfi-api';

export type IBalancesRecord = Record<string, Decimal>;

type BalanceStore = {
  balances: IBalancesRecord;
  fetchBalances: (user: string) => void;
  resetBalance: () => void;
};
/**
 * balance store
 *
 * @example
 * ```ts
 * const {
 *   balances,
 *   fetchBalances,
 *   resetBalance
 * } = useBalanceStore();
 * ```
 */
export const useBalanceStore = create(
  (set: any): BalanceStore => ({
    balances: {},
    fetchBalances: async (user: string) => {
      if (!user) return;

      const { data = {} } = await getBalances(user);

      const balances = Object.entries(data).reduce(
        (record, [symbol, balance]: any) => {
          record[symbol] = new Decimal(balance);
          return record;
        },
        {},
      );

      set({ balances });
    },
    resetBalance: () => set({ balances: {} }),
  }),
);
