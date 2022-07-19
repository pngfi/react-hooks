import create from 'zustand';

import { PublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';
import { IPool, IPoolToken } from '../types';
import { DecimalUtil } from '../helpers/decimal';
import { getPools } from '../common/pngfi-api';

type PoolStore = {
  pools: Record<string, IPool>;
  updatePools: (pools: Record<string, IPool>) => void;
  fetchPoolList: (cache?: boolean) => void;
};

export declare type IRespngsePoolInfo = {
  pubkey: string;
  authority: string;
  curveType: string;
  feeAccount: string;
  feeStructure: string;
  lpSupply: string;
  nonce: string;
  poolTokenDecimals: string;
  poolTokenMint: string;
  tokenA: IPoolToken;
  tokenB: IPoolToken;
};

function toPoolInfo(item: IRespngsePoolInfo) {
  const {
    pubkey,
    authority,
    curveType,
    feeAccount,
    feeStructure,
    lpSupply,
    nonce,
    poolTokenDecimals,
    poolTokenMint,
    tokenA,
    tokenB,
  } = item;

  return {
    address: new PublicKey(pubkey),
    authority: new PublicKey(authority),
    curveType,
    feeAccount: new PublicKey(feeAccount),
    feeStructure,
    lpSupply: DecimalUtil.fromString(lpSupply),
    nonce,
    poolTokenDecimals,
    poolTokenMint: new PublicKey(poolTokenMint),
    tokenA: {
      ...tokenA,
      addr: new PublicKey(tokenA.addr),
      amount: new u64(tokenA.amount),
    },
    tokenB: {
      ...tokenB,
      addr: new PublicKey(tokenB.addr),
      amount: new u64(tokenB.amount),
    },
  };
}

export const usePoolStore = create(
  (set: any): PoolStore => ({
    pools: {},
    updatePools: (pools: Record<string, IPool>) => {
      set({ pools });
    },
    fetchPoolList: async () => {
      const res = await getPools();

      const data = res.data ?? [];
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
