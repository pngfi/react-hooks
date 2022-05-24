import { u64 } from '@solana/spl-token';
import { IFeeStructure } from './pool';
import { ITokenInfo } from './token';

export declare interface QuotePoolParams {
    inputToken: ITokenInfo;
    outputToken: ITokenInfo;
    inputTokenCount: u64; // 
    outputTokenCount: u64; // 
    feeStructure: IFeeStructure;
    slippage: number;
    lamportsPerSignature: number;
    amp?: u64; // 
};

export declare interface IDepositQuote {
    minPoolTokenAmountOut: u64; // 
    maxTokenAIn: u64; // 
    maxTokenBIn: u64; // 
};
export declare interface IWithdrawQuote {
    maxPoolTokenAmountIn: u64; // 
    minTokenAOut: u64; // 
    minTokenBOut: u64; // 
};
