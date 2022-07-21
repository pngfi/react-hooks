import create from 'zustand';
import { getTokens } from '../common/pngfi-api';

type StoreComponent = {
  allTokens: any[];
  fetchTokens: (tokens: any) => void;
  updateAllTokens: (tokens: any) => void;
};

/**
 * tokens store
 *
 * @example
 * ```ts
 * const {
 *   allTokens,
 *   fetchTokens,
 *   updateAllTokens
 * } = useTokensStore();
 * ```
 */
export const useTokensStore = create(
  (set: any): StoreComponent => ({
    allTokens: [],
    fetchTokens: async () => {
      const { data = {} } = await getTokens();
      set({ allTokens: data });
    },
    updateAllTokens: (tokens) => {
      set({ allTokens: tokens });
    },
  }),
);
