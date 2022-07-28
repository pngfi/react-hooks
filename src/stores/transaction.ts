import create from 'zustand';

import { solanaCluster } from '../common/constant';
import { ITransaction } from '../types/common';

type TransactionStore = {
  transactions: Record<string, ITransaction>;
  appendTxn: (transaction: ITransaction) => void;
  updateTxn: (hash: string, obj: any) => void;
  clearTxns: () => void;
};

const localTxnsObj = window.localStorage.getItem('transactions');

const storeTxns = (txns: any) => {
  window.localStorage.setItem(
    'transactions',
    JSON.stringify(
      Object.assign(localTxnsObj ? JSON.parse(localTxnsObj) : {}, {
        [solanaCluster()]: txns,
      }),
    ),
  );
};

/**
 * Transaction store
 *
 * @example
 * ```ts
 * const {
 *   transactions,
 *   appendTxn,
 *   updateTxn,
 *   clearTxns
 * } = useTransactionStore();
 * ```
 */
export const useTransactionStore = create(
  (set: any, get: any): TransactionStore => ({
    transactions: localTxnsObj
      ? JSON.parse(localTxnsObj)[solanaCluster()] || {}
      : {},
    appendTxn: (transaction: ITransaction) => {
      set((state: any) => ({
        transactions: {
          ...state.transactions,
          [transaction.hash]: transaction,
        },
      }));

      const txns = get().transactions;
      storeTxns(txns);
    },
    updateTxn: (hash: string, obj: any) => {
      set((state: any) => ({
        transactions: {
          ...state.transactions,
          [hash]: { ...state.transactions[hash], ...obj },
        },
      }));
      const txns = get().transactions;
      storeTxns(txns);
    },
    clearTxns: () => {
      set({ transactions: {} });
      window.localStorage.setItem(
        'transactions',
        JSON.stringify(
          Object.assign(localTxnsObj ? JSON.parse(localTxnsObj) : {}, {
            [solanaCluster()]: null,
          }),
        ),
      );
    },
  }),
);
