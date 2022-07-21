import { PublicKey, SystemProgram } from '@solana/web3.js';
import type { PublicKey as IPublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN, Idl, Program, Provider } from '@project-serum/anchor';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
import idl from './idl.json';
import { BUD_REWARD_ID } from '../../common/constant';
import {
  deriveAssociatedTokenAddress,
  resolveOrCreateAssociatedTokenAddress,
} from '../../helpers/ata';

export class Rewards {
  public rewardsInfo: any;
  private program: Program;
  private owner: IPublicKey;

  constructor(provider: Provider, rewardsInfo: any, owner: IPublicKey) {
    this.rewardsInfo = rewardsInfo;
    this.program = new Program(idl as Idl, BUD_REWARD_ID, provider as any);
    this.owner = owner;
  }

  async getClaimStatusInfo() {
    const { distributor } = this.rewardsInfo;
    const owner = this.owner;

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

  async claim(): Promise<TransactionEnvelope> {
    const { distributor, amount, index, proof } = this.rewardsInfo;
    // const owner = this.program.provider.wallet?.publicKey;

    const distributorAcc = await this.program.account.merkleDistributor.fetch(
      new PublicKey(distributor),
    );

    const [claimStatus, claimNonce] = await PublicKey.findProgramAddress(
      [
        Buffer.from('ClaimStatus'),
        new PublicKey(distributor).toBuffer(),
        this.owner.toBuffer(),
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
        this.owner,
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
          claimant: this.owner,
          payer: this.owner,
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
  }
}
