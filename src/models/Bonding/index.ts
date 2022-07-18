import { PublicKey } from '@solana/web3.js';

import { u64, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import idl from './idl.json';

import { Idl, Program, Provider } from '@project-serum/anchor';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
import Decimal from 'decimal.js';
import { IBondingConfig, IBonding, IPayoutInfo } from '../../types';
import { PNG_BONDING_ID } from '../../common/constant';
import { DecimalUtil } from '../../helpers/decimal';
import { deriveAssociatedTokenAddress, resolveOrCreateAssociatedTokenAddress } from '../../helpers/ata';

const BONDING_SEED_PREFIX = 'bonding_authority';

export class Bonding {
  public config: IBondingConfig;
  public bondingInfo: IBonding;
  private program: Program;
  private owner: PublicKey;

  constructor(provider: Provider, config: IBondingConfig, bondingInfo: IBonding, owner: PublicKey) {
    this.config = config;
    this.bondingInfo = bondingInfo;
    this.program = new Program(idl as Idl, PNG_BONDING_ID, provider as any);
    this.owner = owner;
  }

  private decay(bondingInfo: IBonding): u64 {
    const { lastDecay, totalDebt, decayFactor } = bondingInfo;

    const duration = Math.floor(new Date().getTime() / 1000 - lastDecay);
    const decay = totalDebt.mul(new u64(duration)).div(new u64(decayFactor));

    return decay.gt(totalDebt) ? totalDebt : decay;
  }

  private valueOf(amount: u64, payoutTokenDecimals: number, depositTokenDecimals: number): u64 {
    return amount
      .mul(new u64(Math.pow(10, payoutTokenDecimals)))
      .div(new u64(Math.pow(10, depositTokenDecimals)));
  }

  private debtRatio(totalDebt: u64, tokenSupply: u64, payoutTokenDecimals: number, bondingInfo: IBonding): u64 {
    return totalDebt
      .sub(this.decay(bondingInfo))
      .mul(new u64(Math.pow(10, payoutTokenDecimals)))
      .div(tokenSupply);
  }

  private price(bondingInfo: IBonding, payoutTokenDecimals: number): u64 {
    const { totalDebt, bondingSupply, controlVariable, minPrice } = bondingInfo;
    const debtRatio = this.debtRatio(totalDebt, bondingSupply, payoutTokenDecimals, bondingInfo);

    const price = debtRatio
      .mul(new u64(controlVariable))
      .div(new u64(Math.pow(10, payoutTokenDecimals - 3)));

    return price.lt(minPrice) ? minPrice : price;
  }

  calcPayout(
    bondingInfo: IBonding,
    payoutTokenDecimals: number,
    depositTokenDecimals: number,
    amount = 1
  ): IPayoutInfo {

    const valuation = this.valueOf(
      DecimalUtil.toU64(new Decimal(amount), depositTokenDecimals),
      payoutTokenDecimals,
      depositTokenDecimals
    );

    const price = this.price(bondingInfo, payoutTokenDecimals);
    const payout = valuation.mul(new u64(Math.pow(10, 5))).div(price);

    return {
      payoutAmount: payout,
      internalPrice: price
    }

  }

  async bond(amount: u64): Promise<TransactionEnvelope> {

    const owner = this.owner;

    const [bondingPda] = await PublicKey.findProgramAddress(
      [Buffer.from(BONDING_SEED_PREFIX), this.config.address.toBuffer()],
      this.program.programId
    );

    const userDepositHolder = await deriveAssociatedTokenAddress(owner, this.bondingInfo.depositTokenMint);

    const { address: userPayoutHolder, ...resolveUserPayoutHolderInstrucitons } =
      await resolveOrCreateAssociatedTokenAddress(
        this.program.provider.connection,
        owner,
        this.bondingInfo.payoutTokenMint,
        amount
      );

    const bondInstruction = this.program.instruction.bond(
      amount,
      new u64(1e12),
      {
        accounts: {
          bonding: this.config.address,
          bondingPda,
          depositTokenMint: this.bondingInfo.depositTokenMint,
          depositHolder: this.bondingInfo.depositHolder,
          payoutHolder: this.bondingInfo.payoutHolder,
          payoutTokenMint: this.bondingInfo.payoutTokenMint,
          userDepositHolder,
          userPayoutHolder,
          owner,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      }
    );

    return new TransactionEnvelope(
      this.program.provider as any,
      [
        ...resolveUserPayoutHolderInstrucitons.instructions,
        bondInstruction
      ],
      [
        ...resolveUserPayoutHolderInstrucitons.signers
      ]
    );

  }

}