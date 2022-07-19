import { u64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { IBonding } from '../../types';
import { DecimalUtil } from '../decimal';

export type BondingInfoWithInitSupply = IBonding & {
  depositAmount: u64;
  initSupply: u64;
  onlyBonding: boolean;
  isHidden: boolean;
};

export declare type IRespngseBondingInfo = {
  pubkey: string;
  stakingAddress: string;
  payoutHolder: string;
  bondingSupply: string;
  controlVariable: number;
  decayFactor: number;
  depositHolder: string;
  depositAmount: string;
  depositHolderAmount: string;
  depositTokenMint: string;
  initSupply: string;
  lastDecay: number;
  maxDebt: string;
  maxPayoutFactor: string;
  minPrice: string;
  payoutTokenMint: string;
  totalDebt: string;
  vestConfigInfo: {
    [key: string]: any;
  };
  onlyBonding: boolean;
  isHidden: boolean;
};

export function toBondingInfo(
  item: IRespngseBondingInfo,
): BondingInfoWithInitSupply {
  const {
    pubkey,
    stakingAddress,
    payoutHolder,
    bondingSupply,
    controlVariable,
    decayFactor,
    depositHolder,
    depositAmount,
    depositHolderAmount,
    depositTokenMint,
    initSupply,
    lastDecay,
    maxDebt,
    maxPayoutFactor,
    minPrice,
    payoutTokenMint,
    totalDebt,
    vestConfigInfo,
    onlyBonding,
    isHidden,
  } = item;

  return {
    pubkey: new PublicKey(pubkey),
    stakingPubkey: new PublicKey(stakingAddress),
    payoutHolder: new PublicKey(payoutHolder),
    payoutTokenMint: new PublicKey(payoutTokenMint),
    depositHolder: new PublicKey(depositHolder),
    depositAmount: DecimalUtil.toU64(DecimalUtil.fromString(depositAmount)),
    depositTokenMint: new PublicKey(depositTokenMint),
    depositHolderAmount: DecimalUtil.toU64(
      DecimalUtil.fromString(depositHolderAmount),
    ),
    initSupply: DecimalUtil.toU64(DecimalUtil.fromString(initSupply)),
    bondingSupply: DecimalUtil.toU64(DecimalUtil.fromString(bondingSupply)),
    maxPayoutFactor: DecimalUtil.toU64(DecimalUtil.fromString(maxPayoutFactor)),
    maxDebt: DecimalUtil.toU64(DecimalUtil.fromString(maxDebt)),
    minPrice: DecimalUtil.toU64(DecimalUtil.fromString(minPrice)),
    totalDebt: DecimalUtil.toU64(DecimalUtil.fromString(totalDebt)),
    controlVariable,
    decayFactor,
    lastDecay,
    vestConfigInfo: {
      pubkey: new PublicKey(vestConfigInfo.pubkey),
      vestMint: new PublicKey(vestConfigInfo.vestMint),
      claimAllDuration: vestConfigInfo.claimAllDuration,
      halfLifeDuration: vestConfigInfo.halfLifeDuration,
      claimableHolder: new PublicKey(vestConfigInfo.claimableHolder),
      claimableMint: new PublicKey(vestConfigInfo.claimableMint),
    },
    onlyBonding,
    isHidden,
  };
}
