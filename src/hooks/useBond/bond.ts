import { findDataByFilter } from '@xweb3/swr-store';
import Decimal from 'decimal.js';
import { useMemo } from 'react';
import type { u64 as Iu64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Provider, TransactionEnvelope } from '@saberhq/solana-contrib';

import { useBalances, usePools, usePrices, useStaking } from '..';
import { DecimalUtil, ZERO_DECIMAL } from '../../helpers/decimal';
import { toBondingInfo, toPoolInfo, toStakingInfo } from '../../helpers/format';
import { useTokens } from '../useToken';
import { useBonding } from '../index';
import { IBonding, IBondingInfoWithTokens, IToken } from '../../types';
import { getTokenAccountInfo } from '../../helpers/account';
import { Bonding } from '../../models/Bonding';
import { Staking } from '../../models/Staking';
import { useZappingStore } from '../../stores/zapping';

export type IBondResponse = {
  /**
   * get bonding total value
   *
   * @example
   * ```typescript
   * const { bondingTotalValue } = useBond(provider);
   * ```
   */
  bondingTotalValue: Decimal;
  /**
   * get format bonding info list
   *
   * @example
   * ```typescript
   * const { bondingInfos } = useBond(provider);
   * ```
   */
  bondingInfos: IBonding[];
  /**
   * get bonding info for submit
   *
   * @example
   * ```typescript
   * const { getBondingItemData } = useBond(provider);
   * const res = getBondingItemData(pubkey);
   * ```
   */
  getBondingItemData: (pubkey: PublicKey) => Record<string, any>;
  /**
   * bond submit
   *
   * @param {IOnBondParams} params
   *
   * @example
   * ```typescript
   * const { onBond } = useBond(provider);
   * const res = await onBond({
   *  ownerAccount,
   *  bondingInfo,
   *  bondingModel,
   *  stakingModel,
   *  depositToken,
   *  amount,
   *  allTokens: tokens,
   *  pngPools: poolInfos,
   *  execute: async (
   *    opTx: TransactionEnvelope,
   *    amount: string,
   *    token: IToken,
   *    isSwap: boolean,
   *   ) => {
   *    return await execute(opTx, amount, token, isSwap);
   *     // const { signature } = await opTx.confirm();
   *   },
   *   jupSwap: async (amount: Iu64, token: IToken) => {
   *     return await swap(amount, token);
   *   },
   *   userVestingInfo
   * });
   * ```
   */
  onBond: (params: IOnBondParams) => Promise<any>;
};

export type IOnBondParams = {
  ownerAccount: PublicKey;
  bondingInfo: IBondingInfoWithTokens;
  bondingModel: Bonding;
  stakingModel: Staking;

  depositToken: IToken;
  amount: Iu64;
  execute: (
    opTx: TransactionEnvelope,
    amount: string,
    token: IToken,
    isSwap: boolean,
  ) => Promise<any>;
  swap: (amount: Iu64, token: IToken) => Promise<any>;
  userVestingInfo: any;
};
export const useBond = (provider: Provider): IBondResponse => {
  const { data: tokens = [] } = useTokens();
  const { data: prices = {} } = usePrices();
  const { data: bondings = [] } = useBonding();
  const { data: stakings = [] } = useStaking();
  const { data: pools = [] } = usePools();
  const { data: balances = {} } = useBalances(
    provider?.wallet?.publicKey ? provider.wallet.publicKey?.toString() : null,
  );
  const stakingInfos = useMemo(() => {
    return stakings.map((info) => toStakingInfo(info));
  }, [stakings]);

  const bondingInfos = useMemo(() => {
    return bondings.map((info) =>
      Object.assign({}, toBondingInfo(info), {
        originMint: findDataByFilter(tokens, {
          mint: new PublicKey(info?.payoutTokenMint).toBase58(),
        })?.mint,
      }),
    );
  }, [bondings, tokens]);

  const poolInfos = useMemo(() => {
    return pools.reduce((res: any, pool) => {
      pool?.tokenA?.symbol &&
        pool?.tokenB?.symbol &&
        (res[pool?.tokenA.symbol + '_' + pool?.tokenB.symbol] =
          toPoolInfo(pool));
      return res;
    }, {});
  }, [pools]);

  const getDepositTokens = (depositToken: IToken) => {
    if (!depositToken) return [];
    const depositTokens = [depositToken];

    if (depositToken.symbol !== 'MEAN_SOL') {
      depositTokens.push(findDataByFilter(tokens, { symbol: 'USDC' }));
    }

    if (depositToken.isLP) {
      const tmpArr = depositToken.symbol.split('_') || [];
      depositTokens.push(findDataByFilter(tokens, { symbol: tmpArr[1] }));
      if (depositToken.symbol === 'MEAN_SOL') {
        depositTokens.push(findDataByFilter(tokens, { symbol: tmpArr[0] }));
      }
    }
    depositTokens.sort(
      (a, b) => Number(balances[b.symbol]) - Number(balances[a.symbol]),
    );
    return depositTokens;
  };

  const bondingTotalValue = useMemo(() => {
    return bondingInfos.reduce((total, bonding) => {
      const payoutToken = findDataByFilter(tokens, {
        mint: bonding?.originMint?.toString(),
      });
      const depositToken = findDataByFilter(tokens, {
        mint: bonding?.depositTokenMint?.toString(),
      });

      const depositTokenPrice = prices[depositToken?.symbol] || 0;
      console.log(
        'depositToken.symbol',
        prices,
        bonding,
        bonding?.originMint?.toString(),
        bonding?.depositTokenMint?.toString(),
        depositToken?.symbol,
        depositTokenPrice,
      );
      let amount = DecimalUtil.fromU64(
        bonding?.depositAmount || ZERO_DECIMAL,
        payoutToken?.decimals || 0,
      );
      if (depositToken?.isLP) {
        amount = amount.mul(DecimalUtil.fromNumber(depositTokenPrice));
      }

      return total.add(amount);
    }, ZERO_DECIMAL);
  }, [bondingInfos, prices, tokens]);

  const getBondingItemData = async (pubkey: PublicKey) => {
    const bondingItemInfo = bondingInfos.find((item) => {
      return item.pubkey.equals(pubkey);
    });
    const stakingItemInfo = stakingInfos.find((item) => {
      return item.pubkey.equals(bondingItemInfo?.stakingPubkey as PublicKey);
    });

    const bondingModel = (() => {
      return new Bonding(
        provider as any,
        { address: bondingItemInfo?.pubkey as PublicKey },
        bondingItemInfo as IBonding,
      );
    })();

    const stakingModel = (() => {
      return new Staking(
        provider,
        {
          address: stakingItemInfo?.pubkey as PublicKey,
          vestConfig: stakingItemInfo?.vestConfigInfo.pubkey as PublicKey,
        },
        stakingItemInfo,
      );
    })();

    const depositToken: IToken = findDataByFilter(tokens, {
      mint: bondingItemInfo?.depositTokenMint?.toString() || '',
    });
    const payoutToken: IToken = findDataByFilter(tokens, {
      mint: bondingItemInfo?.payoutTokenMint?.toString() || '',
    });

    const vestTerm: number = (() =>
      bondingItemInfo
        ? bondingItemInfo.vestConfigInfo.claimAllDuration / (3600 * 24)
        : 0)();

    const assetTokens: any[] = (() => {
      if (!depositToken) return [];
      if (depositToken.isLP) {
        const tmpArr = depositToken?.symbol.split('_') || [];
        const tokenA = findDataByFilter(tokens, { symbol: tmpArr[0] });
        const tokenB = findDataByFilter(tokens, { symbol: tmpArr[1] });
        return [tokenA, tokenB];
      } else {
        return [depositToken];
      }
    })();

    const payoutHolderBalance = await (async () => {
      if (!depositToken || !provider) return ZERO_DECIMAL;
      const data = await getTokenAccountInfo(
        provider,
        bondingItemInfo?.payoutHolder as PublicKey,
      );
      return data?.amount
        ? DecimalUtil.fromU64(data.amount, depositToken.decimals)
        : ZERO_DECIMAL;
    })();

    const payoutInfo = await (async () => {
      if (!bondingItemInfo || !payoutToken || !depositToken) return null;
      return await bondingModel.calcPayout(
        bondingItemInfo,
        payoutToken.decimals || 0,
        depositToken.decimals || 0,
      );
    })();

    const payoutTokenPrice = (() => {
      if (!payoutToken || !prices?.[payoutToken.symbol]) return 0;
      return Number(prices[payoutToken.symbol]);
    })();

    const depositTokenPrice = (() => {
      if (!depositToken || !prices?.[depositToken.symbol]) return 0;
      return prices[depositToken.symbol];
    })();

    const bondingPrice = (() => {
      if (!payoutInfo || !payoutToken) return 0;
      return new Decimal(depositTokenPrice)
        .div(DecimalUtil.fromU64(payoutInfo.payoutAmount, payoutToken.decimals))
        .toNumber();
    })();

    const roi = (() =>
      bondingPrice > 0
        ? ((payoutTokenPrice - bondingPrice) * 100) / bondingPrice
        : null)();

    const isZapBond = ['BUD_PAI', 'UM_PAI', 'MEAN_SOL'].includes(
      depositToken?.symbol,
    );
    const depositTokens = (() => {
      if (!bondingItemInfo) return [];
      if (isZapBond) {
        return getDepositTokens(depositToken);
      } else {
        return [depositToken];
      }
    })();
    const depositTokenNew = isZapBond
      ? depositTokens.find((item) => item.isLP)
      : depositTokens[0];
    console.log('depositTokenNew', depositTokenNew, depositToken);

    const LPTokenBInfo = tokens.find((item) => item.symbol === 'PAI');
    return {
      bondingModel,
      stakingModel,
      bondingInfo: {
        ...bondingItemInfo,
        depositToken,
        depositTokenPrice,
        bondingPrice,
        payoutToken,
        payoutTokenPrice,
        roi,
        vestTerm,
      } as IBondingInfoWithTokens,

      depositToken: depositTokenNew,
      LPTokenBInfo,
      payoutHolderBalance,
      assetTokens,
    };
  };

  const onBond = async ({
    ownerAccount,
    bondingInfo,
    bondingModel,
    stakingModel,

    depositToken,
    amount,

    execute,
    swap,
    userVestingInfo,
  }: IOnBondParams) => {
    const { executeBond } = useZappingStore();
    return await executeBond({
      provider,
      ownerAccount,
      bondingInfo,
      bondingModel,
      stakingModel,
      depositToken,
      amount,
      allTokens: tokens,
      pngPools: poolInfos,
      execute: async (
        opTx: TransactionEnvelope,
        amount: string,
        token: IToken,
        isSwap: boolean,
      ) => {
        return await execute(opTx, amount, token, isSwap);
        // const { signature } = await opTx.confirm();
      },
      jupSwap: async (amount: Iu64, token: IToken) => {
        return await swap(amount, token);
      },
      userVestingInfo,
    });
  };

  return {
    bondingTotalValue,
    bondingInfos,
    getBondingItemData,
    onBond,
  } as IBondResponse;
};
