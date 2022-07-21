import create from 'zustand';
import { getPrices } from '../common/pngfi-api';

type StoreComponent = {
  tokenPrices: Record<string, number>;
  updateOneTokenPrices: (name: string, price: number) => void;
  updateAllTokenPrices: (prices: Record<string, number>) => void;
  fetchTokenPrices: (symbols?: string[]) => void;
};

export const useTokenPriceStore = create(
  (set: any, get: any): StoreComponent => ({
    tokenPrices: {},
    fetchTokenPrices: async (symbols?: string[]) => {
      const { data = {} } = await getPrices(symbols);
      set({ tokenPrices: data });
    },
    updateOneTokenPrices: (name, price) => {
      set({
        tokenPrices: {
          ...get().tokenPrices,
          [name]: price,
        },
      });
    },
    updateAllTokenPrices: (prices: Record<string, number>) => {
      set({ tokenPrices: prices });
    },
  }),
);
