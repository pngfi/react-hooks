import { Buffer } from 'buffer';
import type { PublicKey as IPublicKey } from '@solana/web3.js';
// import { getAssociatedTokenAddress } from '@project-serum/associated-token';
import { Idl, Program, BN } from '@project-serum/anchor';
import { MerkleDistributorSDK } from '@saberhq/merkle-distributor';
import type { Provider } from '@saberhq/solana-contrib';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
const {
  u64,
  TOKEN_PROGRAM_ID,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@solana/spl-token');
import { PublicKey, SystemProgram } from '@solana/web3.js';
import create from 'zustand';
import { IMerkleDistributorInfo, IMerkleRewardsResponse } from '../types';
import {
  merkleDistributors,
  merkleRewardsDistributors,
} from '../common/bunnyducky-api';
import { getMerkleRewards } from '../common/pngfi-merkle-rewards-api';
import { DecimalUtil } from '../helpers/decimal';
import {
  distributorProgramIdl,
  PNG_DISTRIBUTOR_PROGRAM_ID,
} from '../models/Rewards/distributor';
import {
  deriveAssociatedTokenAddress,
  resolveOrCreateAssociatedTokenAddress,
} from '../helpers/ata';
import { TransactionBuilder } from '../helpers/transactionBuilder';

type IRewardsStore = {
  fetchUnclaimed: (owner: IPublicKey, tokens: any[]) => Promise<void>;
  getClaimStatus: (
    provider: Provider,
    owner: IPublicKey,
    info: any,
  ) => Promise<any>;
  claimCommon: (
    provider: Provider,
    owner: IPublicKey,
    info: any,
  ) => Promise<any>;
  claimOne: (
    provider: Provider,
    owner: IPublicKey,
    info: IMerkleDistributorInfo,
  ) => Promise<TransactionEnvelope>;
};

/**
 * rewards store
 *
 * @example
 * ```ts
 * const {
 *   fetchUnclaimed,
 *   getClaimStatus,
 *   claimCommon,
 *   claimOne
 * } = useRewardsStore();
 * ```
 */
export const useRewardsStore = create<IRewardsStore>(() => ({
  fetchUnclaimed: async (owner, tokens) => {
    const [res, commonRes, newRes] = await Promise.all([
      merkleDistributors(owner.toString())
        .then((res) => res.data)
        .catch((err) => {
          console.error('merkleDistributors', err);
        }),
      getMerkleRewards(owner.toString())
        .then((res) => res.data)
        .then((rewards) =>
          rewards.map((r: IMerkleRewardsResponse) => ({
            address: r.distributor,
            amount: r.amount,
            unclaimed: r.unclaimed,
            index: r.index,
            campaignName: r.title,
            proof: r.proof,
            mint: r.mint,
            holder: r.tokenHolder,
            isCommon: true,
          })),
        )
        .catch((_err) => {
          console.error('getMerkleRewards', _err);
        }),
      merkleRewardsDistributors(owner.toString())
        .then((res) => res.data?.data)
        .then((r) => ({
          ...r,
          address: r.distributor,
          mint: 'sBUDzitkrHNZAR2gAoRorwSo6nqBEsHfRmdybHCsw8o',
        }))
        .catch((err) => {
          console.error('merkleRewardsDistributors', err);
        }),
    ]);

    const allData = (res || []).concat(
      (commonRes || []).concat(newRes ? [newRes] : []),
    );
    return allData.map(
      (i: {
        mint: string;
        amount: string;
        isCommon: any;
        unclaimed: string;
      }) => {
        const token =
          tokens.find(
            (t) =>
              t.mint ===
              (i.mint === 'sBUDzitkrHNZAR2gAoRorwSo6nqBEsHfRmdybHCsw8o'
                ? 'BUD1144GGYwmMRFs4Whjfkom5UHqC9a8dZHPVvR2vfPx'
                : i.mint),
          ) ?? tokens[0];
        const reInfo = {
          ...i,
          token,
          amount: DecimalUtil.fromString(i.amount, token.decimals),
          amountStr: i.amount,
        };
        return i.isCommon
          ? {
              ...reInfo,
              leftAmount: DecimalUtil.fromString(i.unclaimed, token.decimals),
            }
          : reInfo;
      },
    );
  },
  getClaimStatus: async (provider, owner, address) => {
    const program = new Program(
      distributorProgramIdl as Idl,
      PNG_DISTRIBUTOR_PROGRAM_ID,
      provider as any,
    );
    const [claimStatus] = await PublicKey.findProgramAddress(
      [
        Buffer.from('ClaimStatus'),
        new PublicKey(address).toBuffer(),
        owner.toBuffer(),
      ],
      program.programId,
    );

    let claimStatusAcc;
    try {
      claimStatusAcc = await program.account.claimStatus.fetch(claimStatus);
    } catch (err) {}
    return claimStatusAcc;
  },
  claimCommon: async (provider, owner, info) => {
    const { proof, amountStr, index, address, mint } = info;
    const program = new Program(
      distributorProgramIdl as Idl,
      PNG_DISTRIBUTOR_PROGRAM_ID,
      provider as any,
    );

    const [claimStatus, claimNonce] = await PublicKey.findProgramAddress(
      [
        Buffer.from('ClaimStatus'),
        new PublicKey(address).toBuffer(),
        owner.toBuffer(),
      ],
      program.programId,
    );

    const distributorHolder = await deriveAssociatedTokenAddress(
      new PublicKey(address),
      new PublicKey(mint),
    );
    // const sDistributoerHolder = await getAssociatedTokenAddress(
    //   new PublicKey(address),
    //   new PublicKey(mint),
    // );

    const { address: userHolder, ...resolveUserHolderInstrucitons } =
      await resolveOrCreateAssociatedTokenAddress(
        program.provider.connection,
        owner,
        new PublicKey(mint),
      );

    const rewardsInstruction = program.instruction.claim(
      new BN(claimNonce),
      new BN(index),
      new BN(amountStr),
      proof.map((p: any) => Buffer.from(p, 'hex')),
      {
        accounts: {
          distributor: new PublicKey(address),
          claimStatus,
          from: distributorHolder,
          to: userHolder,
          claimant: owner,
          payer: owner,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      },
    );

    return new TransactionEnvelope(
      program.provider as any,
      [...resolveUserHolderInstrucitons.instructions, rewardsInstruction],
      [...resolveUserHolderInstrucitons.signers],
    );
  },
  claimOne: async (provider, owner, info) => {
    const txBuilder = new TransactionBuilder(provider as any);

    const sdk = MerkleDistributorSDK.load({ provider });
    const distributor = await sdk.loadDistributor(
      new PublicKey(info.distributor),
    );

    const status = await provider.connection.getAccountInfo(
      new PublicKey(info.claimAddress),
    );
    if (status) {
      throw new Error('already claimed');
    }

    const { instructions: claimMintTokenAccount } =
      await resolveOrCreateAssociatedTokenAddress(
        provider.connection,
        owner,
        new PublicKey(info.mint),
      );

    const claimInstruction = await distributor.claimIX(
      {
        index: new u64(info.index),
        amount: new u64(info.amount),
        proof: info.proofs.map((p) => Buffer.from(p, 'hex')),
        claimant: owner,
      },
      owner,
    );
    txBuilder.addInstruction({
      instructions: [...claimMintTokenAccount, claimInstruction],
      cleanupInstructions: [],
      signers: [],
    });

    return txBuilder.build() as TransactionEnvelope;
  },
}));
