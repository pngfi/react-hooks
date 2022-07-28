import { PublicKey } from '@solana/web3.js';
const {
  u64,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@solana/spl-token');
import { IPoolTokenResponse } from '../../types';
import { DecimalUtil } from '../decimal';

export declare type IResponsePoolInfo = {
  pubkey: string;
  authority: string;
  curveType: string;
  feeAccount: string;
  feeStructure: string;
  lpSupply: string;
  nonce: string;
  poolTokenDecimals: string;
  poolTokenMint: string;
  tokenA: IPoolTokenResponse;
  tokenB: IPoolTokenResponse;
};

export function toPoolInfo(item: IResponsePoolInfo) {
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
      amount: new u64(tokenA.amount || '0'),
    },
    tokenB: {
      ...tokenB,
      addr: new PublicKey(tokenB.addr),
      amount: new u64(tokenB.amount || '0'),
    },
  };
}
