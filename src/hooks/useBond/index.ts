import { findDataByFilter } from '@xweb3/swr-store';
import Decimal from 'decimal.js';
import { useMemo } from 'react';
import { u64 } from '@solana/spl-token';
import { usePools, usePrices, useStaking } from '..';
import { DecimalUtil, ZERO_DECIMAL } from '../../helpers/decimal';
import { toBondingInfo, toPoolInfo, toStakingInfo } from '../../helpers/format';
import { useTokenByMint, useTokens } from '../useToken';
import { useBonding } from '../index';
import { PublicKey } from '@solana/web3.js';
import { IBonding, IBondingInfoWithTokens, IToken } from '../../types';
import { Provider, TransactionEnvelope } from '@saberhq/solana-contrib';
import { getTokenAccountInfo } from '../../helpers/account';
import { Bonding } from '../../models/Bonding';
import { Staking } from '../../models/Staking';
import { useZappingStore } from '../../stores/zapping';

export type IBondResponse = {
  bondingTotalValue: Decimal;
  getBondingItemData: Record<string, any>;
  onBond: (params: IOnBondParams) => Promise<any>;
};

export type IStakeResponse = {
  stakingTotalValue: Decimal;
  getStakingItemData: Record<string, any>;
  onStake: () => void;
};

export type IOnBondParams = {
  provider: Provider;
  ownerAccount: PublicKey;
  bondingInfo: IBondingInfoWithTokens;
  bondingModel: Bonding;
  stakingModel: Staking;

  depositToken: IToken;
  amount: u64;
  execute: (
    opTx: TransactionEnvelope,
    amount: string,
    token: IToken,
    isSwap: boolean,
  ) => Promise<any>;
  swap: (amount: u64, token: IToken) => Promise<any>;
  userVestingInfo: any;
}
export const useBond = (): IBondResponse => {
  const { data: tokens } = useTokens();
  const { data: prices } = usePrices();
  const { data: bondings = [] } = useBonding();
  const { data: stakings = [] } = useStaking();
  const { data: pools = [] } = usePools();

  const stakingInfos = useMemo(() => {
    return stakings.map((info) => toStakingInfo(info));
  }, [stakings]);

  const bondingInfos = useMemo(() => {
    return bondings.map((info) =>
      Object.assign({}, toBondingInfo(info), {
        originMint: tokens.find(
          (item) =>
            item.mint === new PublicKey(info?.payoutTokenMint).toBase58(),
        )?.mint,
      }),
    );
  }, [bondings]);

  const poolInfos = useMemo(() => {
    return pools.reduce((res: any, pool) => {
      res[pool.tokenA.symbol + '_' + pool.tokenB.symbol] = toPoolInfo(pool);
      return res;
    }, {});
  }, [pools]);

  const bondingTotalValue = useMemo(() => {
    return bondingInfos.reduce((total, bonding) => {
      const payoutToken = findDataByFilter(tokens, {
        mint: bonding?.originMint?.toString(),
      });
      const depositToken = findDataByFilter(tokens, {
        mint: bonding.depositTokenMint.toString(),
      });
      const depositTokenPrice = prices[depositToken.symbol] || 0;
      const amount = depositToken.isLP
        ? DecimalUtil.fromU64(
            bonding?.depositAmount,
            payoutToken?.decimals,
          ).mul(DecimalUtil.fromNumber(depositTokenPrice))
        : DecimalUtil.fromU64(bonding?.depositAmount, payoutToken.decimals);

      return total.add(amount);
    }, ZERO_DECIMAL);
  }, []);

  const getBondingItemData = (provider: Provider, pubkey: PublicKey) => {
    const bondingItemInfo = bondingInfos.find((item) => {
      return item.pubkey.equals(pubkey);
    });
    const stakingItemInfo = stakingInfos.find((item) => {
      return item.pubkey.equals(bondingItemInfo?.stakingPubkey as PublicKey);
    });

    const bondingModel = useMemo(() => {
      return new Bonding(
        provider as any,
        { address: bondingItemInfo?.pubkey as PublicKey },
        bondingItemInfo as IBonding,
      );
    }, [bondingItemInfo, provider]);

    const stakingModel = useMemo(() => {
      return new Staking(
        provider,
        {
          address: stakingItemInfo?.pubkey as PublicKey,
          vestConfig: stakingItemInfo?.vestConfigInfo.pubkey as PublicKey,
        },
        stakingItemInfo,
      );
    }, [stakingItemInfo, provider]);

    const depositToken: IToken = useTokenByMint(
      bondingItemInfo?.depositTokenMint?.toString() || '',
    );
    const payoutToken: IToken = useTokenByMint(
      bondingItemInfo?.payoutTokenMint?.toString() || '',
    );

    const vestTerm: number = useMemo(
      () =>
        bondingItemInfo
          ? bondingItemInfo.vestConfigInfo.claimAllDuration / (3600 * 24)
          : 0,
      [bondingItemInfo],
    );

    const assetTokens: any[] = useMemo(() => {
      if (!depositToken) return [];
      if (depositToken.isLP) {
        const tmpArr = depositToken?.symbol.split('_') || [];
        const tokenA = findDataByFilter(tokens, { symbol: tmpArr[0] });
        const tokenB = findDataByFilter(tokens, { symbol: tmpArr[1] });
        return [tokenA, tokenB];
      } else {
        return [depositToken];
      }
    }, [depositToken, tokens]);

    const payoutHolderBalance = useMemo(async () => {
      if (!depositToken || !provider) return ZERO_DECIMAL;
      const data = await getTokenAccountInfo(
        provider,
        bondingItemInfo?.payoutHolder as PublicKey,
      );
      return data?.amount
        ? DecimalUtil.fromU64(data.amount, depositToken.decimals)
        : ZERO_DECIMAL;
    }, [bondingItemInfo]);

    const payoutInfo = useMemo(() => {
      if (!bondingItemInfo || !payoutToken || !depositToken) return null;
      return bondingModel.calcPayout(
        bondingItemInfo,
        payoutToken.decimals || 0,
        depositToken.decimals || 0,
      );
    }, [bondingItemInfo, payoutToken, depositToken, bondingModel]);

    const payoutTokenPrice = useMemo(() => {
      if (!payoutToken || !prices?.[payoutToken.symbol]) return 0;
      return Number(prices[payoutToken.symbol]);
    }, [payoutToken, prices]);

    const depositTokenPrice = useMemo(() => {
      if (!depositToken || !prices?.[depositToken.symbol]) return 0;
      return prices[depositToken.symbol];
    }, [prices, depositToken]);

    const bondingPrice = useMemo(() => {
      if (!payoutInfo || !payoutToken) return 0;
      return new Decimal(depositTokenPrice)
        .div(DecimalUtil.fromU64(payoutInfo.payoutAmount, payoutToken.decimals))
        .toNumber();
    }, [payoutInfo, payoutToken, depositTokenPrice]);

    const roi = useMemo(
      () =>
        bondingPrice > 0
          ? ((payoutTokenPrice - bondingPrice) * 100) / bondingPrice
          : null,
      [payoutTokenPrice, bondingPrice],
    );

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

      payoutHolderBalance,
      assetTokens,
    };
  };

  const onBond = async ({
    provider,
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
      provider: provider as any,
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
      jupSwap: async (amount: u64, token: IToken) => {
        return await swap(amount, token);
      },
      userVestingInfo,
    });
  };

  return {
    bondingTotalValue,
    getBondingItemData,
    onBond,
  } as IBondResponse;
};

export const useStake = (): IStakeResponse => {
  const { data: tokens } = useTokens();
  const { data: prices } = usePrices();
  const { data: stakings = [] } = useStaking();

  const stakingInfos = useMemo(() => {
    return stakings.map((info) => toStakingInfo(info));
  }, [stakings]);

  const stakingTotalValue = useMemo(() => {
    return stakingInfos.reduce((total, info) => {
      const sTokenInfo = findDataByFilter(tokens, {
        mint: info.sTokenMint.toString(),
      });
      const payoutToken = findDataByFilter(tokens, {
        mint: sTokenInfo?.originMint,
      });
      const amount = DecimalUtil.fromU64(
        info.tokenHolderAmount,
        payoutToken.decimals,
      );
      const payoutTokenPrice = prices[payoutToken.symbol] || 0;
      return total.add(amount.mul(new Decimal(payoutTokenPrice)));
    }, ZERO_DECIMAL);
  }, [stakingInfos, tokens, prices]);

  const getStakingItemData = (pubkey: PublicKey) => {
    return {
      pubkey,
    };
  };

  const onStake = () => {
    return;
  };

  return {
    stakingTotalValue,
    getStakingItemData,
    onStake,
  } as IStakeResponse;
};
