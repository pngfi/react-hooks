import { BN, Idl, Program, Provider } from '@project-serum/anchor';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Buffer } from 'buffer';

import { BUD_REWARD_ID } from '../../common/constant';
import {
  deriveAssociatedTokenAddress,
  resolveOrCreateAssociatedTokenAddress,
} from '../../helpers/ata';
import { IRewardsInfo } from '../../hooks/useRewards';
import idl from './idl.json';

const {
  TOKEN_PROGRAM_ID,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@solana/spl-token');

export class Rewards {
  public rewardsInfo: IRewardsInfo;
  private program: Program;

  constructor(provider: Provider, rewardsInfo: IRewardsInfo | undefined) {
    this.rewardsInfo = rewardsInfo as IRewardsInfo;
    this.program = new Program(idl as Idl, BUD_REWARD_ID, provider as any);
  }

  getClaimStatusInfo = async () => {
    const { distributor } = this.rewardsInfo;

    const {
      publicKey,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wallet: { publicKey: publicKey2 },
    } = this.program.provider || {};
    const owner = publicKey2 || publicKey;
    // const owner = this.program.provider.publicKey as IPublicKey;

    const [claimStatus] = await PublicKey.findProgramAddress(
      [
        Buffer.from('ClaimStatus'),
        new PublicKey(distributor).toBuffer(),
        owner.toBuffer(),
      ],
      this.program.programId,
    );
    let claimStatusAcc;

    try {
      claimStatusAcc = await this.program.account.claimStatus.fetch(
        claimStatus,
      );
    } catch (error) {
      console.log(error);
    }
    return claimStatusAcc;
  }

  claim = async (): Promise<TransactionEnvelope> => {
    const { distributor, amount = 0, index = 0, proof = [] } = this.rewardsInfo;

    const {
      publicKey,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wallet: { publicKey: publicKey2 },
    } = this.program.provider || {};
    const owner = publicKey2 || publicKey;
    // const owner = this.program.provider.publicKey as PublicKey;

    const distributorAcc = await this.program.account.merkleDistributor.fetch(
      new PublicKey(distributor),
    );

    const [claimStatus, claimNonce] = await PublicKey.findProgramAddress(
      [
        Buffer.from('ClaimStatus'),
        new PublicKey(distributor).toBuffer(),
        owner.toBuffer(),
      ],
      this.program.programId,
    );

    const distributorHolder = await deriveAssociatedTokenAddress(
      new PublicKey(distributor),
      distributorAcc.mint as PublicKey,
    );
    const { address: userHolder, ...resolveUserHolderInstrucitons } =
      await resolveOrCreateAssociatedTokenAddress(
        this.program.provider.connection,
        owner,
        distributorAcc.mint as PublicKey,
      );

    const rewardsInstruction = this.program.instruction.claim(
      new BN(claimNonce),
      new BN(index),
      new BN(amount),
      proof.map((p: any) => Buffer.from(p, 'hex')),
      {
        accounts: {
          distributor: new PublicKey(distributor),
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
      this.program.provider as any,
      [...resolveUserHolderInstrucitons.instructions, rewardsInstruction],
      [...resolveUserHolderInstrucitons.signers],
    );
  };

  getRoot = async (distributor: string) => {
    return await this.program.account.merkleDistributor
      .fetch(new PublicKey(distributor))
      .then((info) => {
        return {
          root: Array.from(info.root as any, function (byte: any) {
            return ('0' + (byte & 0xff).toString(16)).slice(-2);
          }).join(''),
          totalAmount: (info.maxTotalClaim as BN).toNumber(),
          totalAmountClaimed: (info.totalAmountClaimed as BN).toNumber(),
          numNodes: (info.maxNumNodes as BN).toNumber(),
          adminAuth: (info.adminAuth as PublicKey).toString(),
          numNodesClaimed: (info.numNodesClaimed as BN).toNumber(),
        };
      });
  }
}
