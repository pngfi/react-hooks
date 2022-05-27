import { PublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';

export declare interface ILPInfo {
    tokenAHolder: PublicKey;
    tokenBHolder: PublicKey;
    tokenADecimals: number;
    tokenBDecimals: number;
};
export declare interface IPayoutInfo {
    payoutAmount: u64; // 
    internalPrice: u64; // 
};
export declare interface IBondingConfig {
    address: PublicKey;
};
export declare interface IBondingInfo {
    depositAmount: string;
    initDebt: null;
    initSupply: string;
    onlyBonding: boolean;
    stakingAddress: string;
    pubkey: PublicKey;
    stakingPubkey: PublicKey;
    payoutHolder: PublicKey;
    bondingSupply: u64; // 
    depositHolder: PublicKey;
    depositHolderAmount: u64; // 
    depositTokenMint: PublicKey;
    maxDebt: u64; // 
    maxPayoutFactor: u64; // 
    minPrice: u64; // 
    payoutTokenMint: PublicKey;
    totalDebt: u64; // 
    controlVariable: number;
    decayFactor: number;
    lastDecay: number;
    vestConfigInfo: IVestConfigInfo;
};
export declare interface IVestConfigInfo {
    vestMint: PublicKey;
    claimAllDuration: number;
    halfLifeDuration: number;
    claimableHolder: PublicKey;
    claimableMint: PublicKey;
};
