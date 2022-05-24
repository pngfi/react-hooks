
import { PublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';

export declare interface IStakingConfig {
    address: PublicKey;
    vestConfig: PublicKey;
};
export declare interface IStakingInfo {
    pubkey: PublicKey;
    tokenMint: PublicKey;
    sTokenMint: PublicKey;
    tokenHolder: PublicKey;
    payoutTokenMint: PublicKey;
    tokenHolderAmount: u64; // 
    rebaseEpochDuration: number;
    rebaseLastTime: number;
    rebaseRateNumerator: number;
    rebaseRateDenominator: number;
    rewardsHolder: PublicKey;
    apy: number;
    rewardsPerDay: string;
    rebaseSupply: u64; // 
    sTokenMintSupply: u64; // 
    rebaseRewardsAmount: u64; // 
    vestConfigInfo: IVestConfigInfo;
};

declare interface IVestConfigInfo {
    pubkey: PublicKey;
    vestMint: PublicKey;
    claimAllDuration: number;
    halfLifeDuration: number;
    claimableHolder: PublicKey;
    claimableMint: PublicKey;
}
export declare interface IUserVestingInfo {
    pubkey: PublicKey;
    claimableAmount: u64; // 
    lastUpdatedTime: u64; // 
    lastVestTime: u64; // 
    owner: PublicKey;
    vestConfig: PublicKey;
    vestedHolder: PublicKey;
    vestedHolderAmount: u64; // 
};
