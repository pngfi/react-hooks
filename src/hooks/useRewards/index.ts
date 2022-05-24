import {
  TOKEN_PROGRAM_ID, 
  u64
} from '@solana/spl-token';
import {
  Idl, Program, BN
} from '@project-serum/anchor';
import {
  Provider,
  TransactionEnvelope
} from '@saberhq/solana-contrib';
import { PublicKey, PublicKeyInitData, SystemProgram } from '@solana/web3.js';
import { MerkleDistributorSDK } from '@saberhq/merkle-distributor';
import { distributorProgramIdl, PNG_DISTRIBUTOR_PROGRAM_ID } from '../../config/distributor';
import { deriveAssociatedTokenAddress, resolveOrCreateAssociatedTokenAddress } from '../../helpers/ata';
import { TransactionBuilder } from '../../helpers/transactionBuilder';

export interface IRewardsInfo {
  proof: string[];
  distributor: PublicKeyInitData;
  claimAddress?: PublicKeyInitData;
  mint: PublicKeyInitData;
  index: string | number | Buffer | Uint8Array | number[] | BN;
  amount: string | number | Buffer | Uint8Array | number[] | BN;
  createdAt?: number;
}

export interface IRewardsResponse {
  /**
   * claim distributor rewards
   * 
   * @example
   * ```ts
   * import { useRewards } from '@xweb3/react-hooks';
   * const { claimRewards } = useRewards();
   * const claimTx = await claimRewards(provider, publicKey, {
   *   distributor: data.distributor,
   *   amount: data.amount.toString(),
   *   claimAddress: data.claimAddress || '',
   *   proof: data.proof,
   *   mint: data.mint,
   *   index: data.index,
   * });
   *```
   */
  claimRewards: (provider: Provider, owner: PublicKey, info: IRewardsInfo) => Promise<TransactionEnvelope>
  // claimOne: (provider: Provider, owner: PublicKey, info: IRewardsInfo) => Promise<TransactionEnvelope>
  // claimCommon: (provider: Provider, owner: PublicKey, info: IRewardsInfo) => Promise<TransactionEnvelope>
}

export const useRewards = (): IRewardsResponse => {
  const claimRewards = async (provider: Provider, owner: PublicKey, info: IRewardsInfo): Promise<TransactionEnvelope> => {
    if (info.createdAt) {
      return await claimOne(provider, owner, info);
    } else {
      return await claimCommon(provider, owner, info);
    }
  };

  const claimCommon = async (provider: Provider, owner: PublicKey, info: IRewardsInfo): Promise<TransactionEnvelope> => {
    const { proof, amount, index, distributor, mint } = info;
    const program = new Program(distributorProgramIdl as Idl, PNG_DISTRIBUTOR_PROGRAM_ID, provider as any);

    let [claimStatus, claimNonce] = await PublicKey.findProgramAddress(
      [Buffer.from('ClaimStatus'), new PublicKey(distributor).toBuffer(), owner.toBuffer()],
      program.programId
    );

    const distributorHolder = await deriveAssociatedTokenAddress(
      new PublicKey(distributor),
      new PublicKey(mint)
    );

    const { address: userHolder, ...resolveUserHolderInstrucitons } =
      await resolveOrCreateAssociatedTokenAddress(
        program.provider.connection,
        owner,
        new PublicKey(mint)
      );

    const rewardsInstruction = program.instruction.claim(
      new BN(claimNonce),
      new BN(index),
      new BN(amount),
      proof.map((p: string) => Buffer.from(p, 'hex')),
      {
        accounts: {
          distributor: new PublicKey(distributor),
          claimStatus,
          from: distributorHolder,
          to: userHolder,
          claimant: owner,
          payer: owner,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID
        },
      }
    );

    return new TransactionEnvelope(
      program.provider as any,
      [
        ...resolveUserHolderInstrucitons.instructions,
        rewardsInstruction
      ],
      [
        ...resolveUserHolderInstrucitons.signers
      ]
    );

  }

  const claimOne = async (provider: Provider, owner: PublicKey, info: IRewardsInfo): Promise<TransactionEnvelope> => {
    const txBuilder = new TransactionBuilder(provider);

    const sdk = MerkleDistributorSDK.load({ provider });
    const distributor = await sdk.loadDistributor(new PublicKey(info.distributor));

    const status = info.claimAddress ? await provider.connection.getAccountInfo(
      new PublicKey(info.claimAddress)
    ) : false;
    if (status) {
      throw new Error('already claimed');
    }

    const { instructions: claimMintTokenAccount } =
      await resolveOrCreateAssociatedTokenAddress(
        provider.connection,
        owner,
        new PublicKey(info.mint)
      );

    const claimInstruction = await distributor.claimIX(
      {
        index: new u64(info.index),
        amount: new u64(info.amount),
        proof: info.proof.map((p: string) => Buffer.from(p, 'hex')),
        claimant: owner,
      },
      owner
    );
    txBuilder.addInstruction({
      instructions: [...claimMintTokenAccount, claimInstruction],
      cleanupInstructions: [],
      signers: [],
    });

    return txBuilder.build() as TransactionEnvelope;
  }

  return {
    // claimOne,
    // claimCommon,
    claimRewards
  } as IRewardsResponse
};