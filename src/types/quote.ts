import type { u64 as Iu64 } from '@solana/spl-token';

import { IFeeStructure } from './pool';
import { IToken } from './token';

export declare interface QuotePoolParams {
  inputToken: IToken;
  outputToken: IToken;
  inputTokenCount: Iu64;
  outputTokenCount: Iu64;
  feeStructure: IFeeStructure;
  slippage: number;
  lamportsPerSignature: number;
  amp?: Iu64;
}

export declare interface IDepositQuote {
  minPoolTokenAmountOut: Iu64;
  maxTokenAIn: Iu64;
  maxTokenBIn: Iu64;
}
export declare interface IWithdrawQuote {
  maxPoolTokenAmountIn: Iu64;
  minTokenAOut: Iu64;
  minTokenBOut: Iu64;
}
