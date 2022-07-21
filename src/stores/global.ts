import create from 'zustand';

export type GlobalInfo = {
  walletName: string;
  defaultPair: string;
  walletOpen: boolean;
  slippage: number;
};

type GlobalInfoStore = {
  globalInfo: GlobalInfo;
  updateGlobalInfo: (key: string, value: any) => void;
  resetGlobalInfo: () => void;
};

const slippageInStorage: any = window.localStorage.getItem('slippage') || '1';
const prevWalletNameInStorage: any =
  window.localStorage.getItem('PREV_WALLET_NAME');
/**
 * global store
 *
 * @example
 * ```ts
 * const {
 *   globalInfo,
 *   updateGlobalInfo,
 *   resetGlobalInfo
 * } = useGlobalInfoStore();
 * ```
 */
export const useGlobalInfoStore = create(
  (set: any): GlobalInfoStore => ({
    globalInfo: {
      walletName: prevWalletNameInStorage,
      defaultPair: '',
      walletOpen: false,
      slippage: slippageInStorage * 1,
    },
    updateGlobalInfo: (key: string, value: any) => {
      set((state: any) => ({
        globalInfo: { ...state.globalInfo, [key]: value },
      }));

      if (key === 'slippage') {
        window.localStorage.setItem('slippage', value);
      }
    },
    resetGlobalInfo: () => set({ globalInfo: {} }),
  }),
);
