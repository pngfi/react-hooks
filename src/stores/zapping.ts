import { Provider, TransactionEnvelope } from '@saberhq/solana-contrib';
import { TOKEN_PROGRAM_ID } from '@saberhq/token-utils';
import { Buffer } from 'buffer';
import type { PublicKey as IPublicKey } from '@solana/web3.js';
const {
  TokenSwap,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@solana/spl-token-swap');
// import { TokenSwap } from '@solana/spl-token-swap';
import { u64 } from '@solana/spl-token';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import Decimal from 'decimal.js';
import create from 'zustand';
import {
  Currency,
  Liquidity,
  TokenAmount,
  Percent,
  Token as rayToken,
  LiquidityPoolKeysV4,
  LiquidityPoolInfo,
} from '@raydium-io/raydium-sdk';
import { PNG_TOKEN_SWAP_ID, ZERO_U64 } from '../common/constant';
import { IBondingInfoWithTokens, IPool, IPoolRecords, IToken } from '../types';
import { DecimalUtil } from '../helpers/decimal';
import { resolveOrCreateAssociatedTokenAddress } from '../helpers/ata';
import { Bonding, Staking } from '../models';
import {
  deserializeTokenAccount,
  simulateTransaction,
} from '../helpers/account';

export function pngAddLiquidityInstruction(
  poolInfo: IPool,
  ownerAccount: IPublicKey,
  userSourceTokenAccount: IPublicKey,
  userLPTokenAccount: IPublicKey,
  amount: u64,
) {
  return TokenSwap.depositSingleTokenTypeExactAmountInInstruction(
    poolInfo.address,
    poolInfo.authority,
    ownerAccount,
    userSourceTokenAccount, // can be ether tokenA or tokenB tokenAccount
    poolInfo.tokenA.addr,
    poolInfo.tokenB.addr,
    poolInfo.poolTokenMint,
    userLPTokenAccount, // LP
    PNG_TOKEN_SWAP_ID,
    TOKEN_PROGRAM_ID,
    amount,
    0,
  );
}

export async function simulateTransactionAndGetBalanceChanges(
  connection: Connection,
  instructions: TransactionInstruction[],
  owner: IPublicKey,
  tokenAccount: IPublicKey,
) {
  const preBalanceData = await connection.getAccountInfo(tokenAccount);

  const preBalance = preBalanceData
    ? deserializeTokenAccount(preBalanceData.data).amount
    : ZERO_U64;

  const res = await simulateTransaction(connection, owner, instructions, [
    tokenAccount,
  ]);

  if (!res.value.accounts || !res.value.accounts.length) {
    throw new Error(
      `Couldn't get balance changes for token account: ${tokenAccount}`,
    );
  }

  const postBalance = deserializeTokenAccount(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Buffer.from(res?.value?.accounts?.[0]?.data[0], 'base64'),
  );

  const preBalanceAmount = DecimalUtil.fromU64(preBalance);
  const postBalanceAmount = DecimalUtil.fromU64(postBalance.amount);

  const diff = postBalanceAmount.gt(preBalanceAmount)
    ? postBalanceAmount.minus(preBalanceAmount)
    : preBalanceAmount.minus(postBalanceAmount);

  return {
    diff: new u64(diff.toString()),
    preBalance: preBalance.toString(),
    postBalance: postBalance.amount.toString(),
  };
}

export function raydiumSwapInstruction(
  isBase: boolean,
  poolInfo: LiquidityPoolInfo,
  poolKeys: LiquidityPoolKeysV4,
  depositAmount: u64,
  ownerAccount: IPublicKey,
  userLPTokenATokenAccount: IPublicKey,
  userLPTokenBTokenAccount: IPublicKey,
) {
  const amountIn = new TokenAmount(
    isBase
      ? new rayToken(poolKeys.baseMint, poolInfo.baseDecimals)
      : new rayToken(poolKeys.quoteMint, poolInfo.quoteDecimals),
    depositAmount.div(new u64(2)).toNumber(),
    false,
  );

  const currencyOut = isBase
    ? new rayToken(poolKeys.quoteMint, poolInfo.quoteDecimals)
    : new rayToken(poolKeys.baseMint, poolInfo.baseDecimals);

  const slippage = new Percent(10, 100);

  // calculate swap amountOut
  const { minAmountOut } = Liquidity.computeAmountOut({
    poolKeys,
    poolInfo,
    amountIn,
    currencyOut,
    slippage,
  });

  // swap first

  return Liquidity.makeSwapInstruction({
    poolKeys,
    userKeys: {
      tokenAccountIn: isBase
        ? userLPTokenATokenAccount
        : userLPTokenBTokenAccount,
      tokenAccountOut: isBase
        ? userLPTokenBTokenAccount
        : userLPTokenATokenAccount,
      owner: ownerAccount,
    },
    amountIn: amountIn.toFixed(0),
    amountOut: minAmountOut.toFixed(0),
    fixedSide: 'in',
  });
}

function raydiumAddLiquidityInstruction(
  isBase: boolean,
  poolInfo: LiquidityPoolInfo,
  poolKeys: LiquidityPoolKeysV4,
  swapAmount: string,
  ownerAccount: IPublicKey,
  userLPTokenATokenAccount: IPublicKey,
  userLPTokenBTokenAccount: IPublicKey,
  userLPTokenAccount: IPublicKey,
) {
  // calculate swap token amount, and use this token as base to add liquidity
  const liqAmount = new TokenAmount(
    isBase
      ? new rayToken(poolKeys.quoteMint, poolInfo.quoteDecimals)
      : new rayToken(poolKeys.baseMint, poolInfo.baseDecimals),
    swapAmount,
    false,
  );

  // maybe its a bug
  const liqCurrencyOut = new Currency(poolInfo.baseDecimals);

  const slippage = new Percent(5, 100);

  // calculate add liquidity tokenB amount
  const { maxAnotherAmount } = Liquidity.computeAnotherAmount({
    poolKeys,
    poolInfo,
    amount: liqAmount,
    anotherCurrency: liqCurrencyOut,
    slippage,
  });

  return Liquidity.makeAddLiquidityInstruction({
    poolKeys,
    userKeys: {
      baseTokenAccount: userLPTokenATokenAccount,
      quoteTokenAccount: userLPTokenBTokenAccount,
      lpTokenAccount: userLPTokenAccount,
      owner: ownerAccount,
    },
    baseAmountIn: isBase ? maxAnotherAmount.toFixed(0) : liqAmount.toFixed(0),
    quoteAmountIn: isBase ? liqAmount.toFixed(0) : maxAnotherAmount.toFixed(0),
    fixedSide: isBase ? 'quote' : 'base',
  });
}

type ZappingStore = {
  estimatePayoutAmount: (args: {
    bondingModel: Bonding;
    bondingInfo: IBondingInfoWithTokens;
    allTokens: IToken[];
    depositToken: IToken;
    tokenPrices: Record<string, number>;
    amount: string;
  }) => Decimal;
  prepareAccounts: (args: {
    provider: Provider;
    ownerAccount: IPublicKey;
    allTokens: IToken[];
    bondingModel: Bonding;
    bondingInfo: IBondingInfoWithTokens;
    stakingModel: Staking;
    depositToken: IToken;
  }) => Promise<{
    prepareTx: TransactionEnvelope;
    LPTokenBMint: IPublicKey;
    LPTokenBInfo: IToken;
    // userLPTokenBTokenAccount: IPublicKey;
    LPTokenAMint: IPublicKey;
    LPTokenAInfo: IToken;
    userLPTokenATokenAccount: IPublicKey;
    userLPTokenAccount: IPublicKey;
  }>;
  executeBond: (args: {
    provider: Provider;
    ownerAccount: IPublicKey;
    allTokens: IToken[];
    bondingModel: Bonding;
    bondingInfo: IBondingInfoWithTokens;
    stakingModel: Staking;
    depositToken: IToken;
    pngPools: IPoolRecords;
    amount: u64;
    execute: (
      opTx: TransactionEnvelope,
      amount: string,
      token: IToken,
      isSwap: boolean,
    ) => Promise<string>;
    jupSwap?: (amount: u64, token: IToken) => Promise<any>;
    userVestingInfo?: any;
  }) => Promise<string>;
};

/**
 * zapping store
 *
 * @example
 * ```ts
 * const {
 *   estimatePayoutAmount,
 *   prepareAccounts,
 *   executeBond
 * } = useZappingStore();
 * ```
 */
export const useZappingStore = create<ZappingStore>((_set, get) => ({
  estimatePayoutAmount: ({
    tokenPrices,
    bondingModel,
    bondingInfo,
    depositToken,
    allTokens,
    amount,
  }) => {
    let simulateAmount = DecimalUtil.fromU64(
      DecimalUtil.toU64(new Decimal(amount), depositToken.decimals),
    );

    const tmpArr = bondingInfo.depositToken.symbol.split('_') || [];
    const tokenLPA = allTokens.find((item) => item.symbol === tmpArr[0]);
    const tokenLPB = allTokens.find((item) => item.symbol === tmpArr[1]);
    const bondingTokens = [tokenLPA, tokenLPB];

    // if deposit token is not the Bonding LP token => PAI
    if (depositToken.mint !== bondingInfo.depositToken.mint) {
      // and is not part of the Bonding LP tokens => USDC
      if (!bondingTokens.some((t) => t?.mint === depositToken.mint)) {
        // need to swap
        // TODO: get USDC to PAI token price from Jupiter?
        // or add a USDC_PAI price to png prices api
        simulateAmount = simulateAmount.div(tokenPrices['PAI'] ?? 1);
      }
      // need add LP price
      // simulateAmount = simulateAmount.div(
      //   tokenPrices[bondingInfo.depositToken.symbol] ?? 1
      // );

      simulateAmount = simulateAmount.mul(
        depositToken
          ? DecimalUtil.fromNumber(
              tokenPrices[depositToken.symbol],
              depositToken.decimals,
            ).div(
              DecimalUtil.fromNumber(
                tokenPrices[bondingInfo.depositToken.symbol],
                bondingInfo.depositToken.decimals,
              ),
            )
          : 1,
      );
    }
    const payoutInfo = bondingModel.calcPayout(
      bondingInfo,
      Number(bondingInfo.payoutToken.decimals),
      Number(bondingInfo.depositToken.decimals),
      DecimalUtil.fromString(
        simulateAmount.toString(),
        bondingInfo.depositToken.decimals,
      ).toNumber(),
    );

    return DecimalUtil.fromU64(
      payoutInfo.payoutAmount,
      bondingInfo.payoutToken.decimals,
    );
  },
  prepareAccounts: async ({
    provider,
    ownerAccount,
    bondingInfo,
    allTokens,
  }) => {
    const prepareTx = new TransactionEnvelope(provider, []);

    const tmpArr = bondingInfo.depositToken.symbol.split('_') || []; // LP (BUD-PAI LP)
    const LPTokenAInfo = allTokens.find((item) => item.symbol === tmpArr[0]); // BUD
    if (!LPTokenAInfo) throw new Error('LPTokenAInfo is not exists');
    const LPTokenAMint = new PublicKey(LPTokenAInfo.mint);
    // const LPTokenAMint = new PublicKey('MEANeD3XDdUmNMsRGjASkSWdC8prLYsoRJ61pPeHctD');
    // const LPTokenAMint = new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R');

    const LPTokenBInfo = allTokens.find((item) => item.symbol === tmpArr[1]); // PAI
    if (!LPTokenBInfo) throw new Error('LPTokenBInfo is not exists');
    const LPTokenBMint = new PublicKey(LPTokenBInfo.mint);
    // const LPTokenBMint = new PublicKey('So11111111111111111111111111111111111111112');
    // const LPTokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    // const depositMint = new PublicKey(depositToken.mint);
    const LPMint = bondingInfo.depositTokenMint;
    // const LPMint = new PublicKey('7xuP2ubqhEzbxJMZvtPqGLKRVyq4KXRKh4UGJmJaJwZr');
    // const LPMint = new PublicKey('FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m');

    const { address: userLPTokenAccount, ...createUserLPTokenAccount } =
      await resolveOrCreateAssociatedTokenAddress(
        provider.connection,
        ownerAccount,
        LPMint,
      );
    prepareTx.addInstructions(...createUserLPTokenAccount.instructions);

    const {
      address: userLPTokenATokenAccount,
      ...createUserLPTokenATokenAccount
    } = await resolveOrCreateAssociatedTokenAddress(
      provider.connection,
      ownerAccount,
      LPTokenAMint,
    );
    prepareTx.addInstructions(...createUserLPTokenATokenAccount.instructions);

    return {
      prepareTx,
      LPTokenAMint,
      LPTokenAInfo,
      userLPTokenATokenAccount,
      LPTokenBMint,
      LPTokenBInfo,
      // userLPTokenBTokenAccount,
      userLPTokenAccount,
    };
  },
  executeBond: async ({
    provider,
    depositToken,
    ownerAccount,
    amount,
    bondingInfo,
    allTokens,
    bondingModel,
    stakingModel,
    pngPools,
    execute,
    jupSwap,
    userVestingInfo,
  }): Promise<string> => {
    const depositAmount = amount;

    const tmpArr = bondingInfo.depositToken.symbol.split('_') || [];
    const tokenLPA = allTokens.find((item) => item.symbol === tmpArr[0]);
    const tokenLPB = allTokens.find((item) => item.symbol === tmpArr[1]);
    if (!tokenLPA || !tokenLPB) throw new Error('tokenLP is not exists');
    const bondingTokens = [tokenLPA, tokenLPB];

    // if deposit token is Bonding LP token, just bond and stakeAll
    if (depositToken.mint === bondingInfo.depositToken.mint) {
      let tx;
      // only bonding and vesting
      if (bondingInfo.onlyBonding) {
        const vestModel = new Staking(
          provider as any,
          {
            address: bondingInfo.pubkey,
            vestConfig: bondingInfo.vestConfigInfo.pubkey,
          } as any,
          bondingInfo,
        );
        const [bondTx, vestAll]: TransactionEnvelope[] = await Promise.all<any>(
          [
            bondingModel.bond(depositAmount),
            vestModel.vestAll(userVestingInfo, bondingInfo.payoutTokenMint),
          ],
        );
        tx = bondTx.combine(vestAll);
      } else {
        const [bondTx, stakeAllTx, rebaseTx]: TransactionEnvelope[] =
          await Promise.all<any>([
            bondingModel.bond(depositAmount),
            stakingModel.stakeAll(),
            stakingModel.rebase(),
          ]);
        tx = bondTx.combine(stakeAllTx).combine(rebaseTx);
      }

      return execute(
        tx,
        DecimalUtil.fromU64(
          depositAmount,
          bondingInfo.depositToken.decimals,
        ).toString(),
        bondingInfo.depositToken,
        false,
      );
    }

    const {
      prepareTx,
      // userDepositTokenAccount,
      userLPTokenAccount,
      // userLPTokenBTokenAccount,
      LPTokenBMint,
      LPTokenBInfo,
      userLPTokenATokenAccount,
    } = await get().prepareAccounts({
      provider,
      ownerAccount,
      bondingInfo,
      bondingModel,
      stakingModel,
      depositToken,
      allTokens,
    });

    // if deposit token is one of the Bonding LP tokens, just need to addLiquidity and then bond
    if (bondingTokens.some((t) => t.mint === depositToken.mint)) {
      let addLiquidityTx: TransactionEnvelope;

      // Raydium pools single token swap
      if (bondingInfo.depositToken.symbol === 'MEAN_SOL') {
        // select token (MEAN or SOL)
        const isBase = depositToken.mint === tokenLPA.mint;

        const {
          address: userLPTokenBTokenAccount,
          ...createUserLPTokenBTokenAccount
        } = await resolveOrCreateAssociatedTokenAddress(
          provider.connection,
          ownerAccount,
          LPTokenBMint,
          isBase ? new u64(0) : depositAmount,
        );
        prepareTx.addInstructions(
          ...createUserLPTokenBTokenAccount.instructions,
        );
        // Sol signer
        prepareTx.addSigners(...createUserLPTokenBTokenAccount.signers);

        const poolKeys = await Liquidity.fetchAllPoolKeys(
          provider.connection,
        ).then((data) =>
          data.find(
            (p) =>
              p.id.toString() ===
              '57sBQHecBZVxMdHB1pCVNEMyQXmZi7NrxgVRznkDmvKS',
          ),
        );
        if (!poolKeys) throw new Error('poolKeys is not exists');
        // .then(data => data.find(p => p.id.toString() === '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg'));

        const poolInfo = await Liquidity.fetchInfo({
          connection: provider.connection,
          poolKeys,
        });

        // swap
        addLiquidityTx = prepareTx.addInstructions(
          await raydiumSwapInstruction(
            isBase,
            poolInfo,
            poolKeys,
            depositAmount,
            ownerAccount,
            userLPTokenATokenAccount,
            userLPTokenBTokenAccount,
          ),
        );
        const swapSimulateAmount =
          await simulateTransactionAndGetBalanceChanges(
            provider.connection,
            addLiquidityTx.build().instructions,
            ownerAccount,
            isBase ? userLPTokenBTokenAccount : userLPTokenATokenAccount,
          );

        // add liquidity
        addLiquidityTx = prepareTx.addInstructions(
          await raydiumAddLiquidityInstruction(
            isBase,
            poolInfo,
            poolKeys,
            swapSimulateAmount.diff.toString(),
            ownerAccount,
            userLPTokenATokenAccount,
            userLPTokenBTokenAccount,
            userLPTokenAccount,
          ),
        );

        const addLiquidityAmount =
          await simulateTransactionAndGetBalanceChanges(
            provider.connection,
            addLiquidityTx.build().instructions,
            ownerAccount,
            userLPTokenAccount,
          );

        // transaction limit, make two instruction to confirm
        await addLiquidityTx.confirm();

        const vestModel = new Staking(
          provider as any,
          {
            address: bondingInfo.pubkey,
            vestConfig: bondingInfo.vestConfigInfo.pubkey,
          } as any,
          bondingInfo,
        );
        const [bondTx, vestAll]: TransactionEnvelope[] = await Promise.all<any>(
          [
            bondingModel.bond(addLiquidityAmount.diff),
            vestModel.vestAll(userVestingInfo, bondingInfo.payoutTokenMint),
          ],
        );

        return execute(
          bondTx.combine(vestAll),
          DecimalUtil.fromU64(depositAmount, depositToken.decimals).toString(),
          depositToken,
          false,
        );
      } else {
        const {
          address: userLPTokenBTokenAccount,
          ...createUserLPTokenBTokenAccount
        } = await resolveOrCreateAssociatedTokenAddress(
          provider.connection,
          ownerAccount,
          LPTokenBMint,
        );

        prepareTx.addInstructions(
          ...createUserLPTokenBTokenAccount.instructions,
        );
        prepareTx.addSigners(...createUserLPTokenBTokenAccount.signers);

        addLiquidityTx = prepareTx.addInstructions(
          pngAddLiquidityInstruction(
            pngPools[bondingInfo.depositToken.symbol],
            ownerAccount,
            userLPTokenBTokenAccount,
            userLPTokenAccount,
            depositAmount,
          ),
        );

        const addLiquidityAmount =
          await simulateTransactionAndGetBalanceChanges(
            provider.connection,
            addLiquidityTx.build().instructions,
            ownerAccount,
            userLPTokenAccount,
          );

        // TODO: check addLiquidityTx size,
        // if we have to many accounts in prepareTx maybe there is space for bond and stakeAll
        const [bondTx, stakeAllTx, rebaseTx]: TransactionEnvelope[] =
          await Promise.all<any>([
            bondingModel.bond(addLiquidityAmount.diff),
            stakingModel.stakeAll(),
            stakingModel.rebase(),
          ]);

        return execute(
          addLiquidityTx.combine(bondTx).combine(stakeAllTx).combine(rebaseTx),
          DecimalUtil.fromU64(depositAmount, depositToken.decimals).toString(),
          depositToken,
          false,
        );
      }
    }

    // swap USDC to PAI
    const swapResult = jupSwap
      ? await jupSwap(depositAmount, depositToken)
      : null;
    if (!swapResult.txid) return '';
    const LPTokenBAmount = new u64(swapResult.outputAmount);

    // then add liquidity and bond
    return get().executeBond({
      provider,
      depositToken: LPTokenBInfo,
      ownerAccount,
      amount: LPTokenBAmount,
      bondingInfo,
      allTokens,
      bondingModel,
      stakingModel,
      pngPools,
      execute,
    });
  },
}));
