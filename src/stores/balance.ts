import create from 'zustand';
import Decimal from 'decimal.js';
import { getBalances } from '../common/pngfi-api';

export type BalancesRecord = Record<string, Decimal>;

type BalanceStore = {
  balances: BalancesRecord;
  fetchBalances: (user: string) => void;
  resetBalance: () => void;
};

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
