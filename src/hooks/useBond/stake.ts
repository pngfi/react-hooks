import { Provider } from '@saberhq/solana-contrib';
import { PublicKey } from '@solana/web3.js';
import { findDataByFilter } from '@xweb3/swr-store';
import Decimal from 'decimal.js';
import { useMemo } from 'react';

import { DecimalUtil, ZERO_DECIMAL } from '../../helpers/decimal';
import { toStakingInfo } from '../../helpers/format';
import { Staking } from '../../models/Staking';
import { useUserVestingStore } from '../../stores';
import { IStaking } from '../../types';
import { useBalances, usePrices, useStaking } from '..';
import { useTokens } from '../useToken';

export type IStakeResponse = {
  /**
   * get staking total value
   *
   * @example
   * ```typescript
   * const { stakingTotalValue } = useStake(provider);
   * ```
   */
  stakingTotalValue: Decimal;
  /**
   * get format staking info list
   *
   * @example
   * ```typescript
   * const { stakingInfos } = useStake(provider);
   * ```
   */
  stakingInfos: IStaking[];
  /**
   * get staking info for submit
   *
   * @example
   * ```typescript
   * const { getStakingItemData } = useStake(provider);
   * const res = getStakingItemData(pubkey);
   * ```
   */
  getStakingItemData: (pubkey: PublicKey) => Record<string, any>;
  /**
   * stake submit
   *
   * @param {IOnStake} params
   *
   * @example
   * ```typescript
   * const { onStake } = useBond(provider);
   * const [toVTokenTx, stakeAllTx, rebaseTx] = await onStake({
   *  stakingInfo: IStaking;
   *  stakingModel: Staking;
   *  amount: string;
   * });
   * const { signature } = await toVTokenTx
   *    .combine(stakeAllTx)
   *    .combine(rebaseTx)
   *    .confirm();
   */
  onStake: (params: IOnStake) => Promise<any>;
  /**
   * unstake submit
   *
   * @param {IOnUnStake} params
   *
   * @example
   * ```typescript
   * const { onBond } = useBond(provider);
   * const [unstakeTx, vestAllTx, rebaseTx] = await onUnStake({
   *  stakingInfo: IStaking;
   *  stakingModel: Staking;
   *  amount: string;
   * });
   * const { signature } = await unstakeTx
   *      .combine(vestAllTx)
   *      .combine(rebaseTx)
   *      .confirm();
   */
  onUnStake: (params: IOnUnStake) => Promise<any>;
};

export type IOnStake = {
  stakingInfo: IStaking;
  stakingModel: Staking;
  amount: string;
};

export type IOnUnStake = {
  stakingInfo: IStaking;
  stakingModel: Staking;
  amount: string;
};

export const useStake = (provider: Provider): IStakeResponse => {
  const { data: tokens = [] } = useTokens();
  const { data: prices = [] } = usePrices();
  const { data: stakings = [] } = useStaking();
  const { data: balances = {} } = useBalances(
    provider?.wallet?.publicKey ? provider.wallet.publicKey?.toString() : null,
  );

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
        info.tokenHolderAmount || ZERO_DECIMAL,
        payoutToken?.decimals || 0,
      );

      const payoutTokenPrice = prices[payoutToken?.symbol];
      return total.add(amount.mul(new Decimal(payoutTokenPrice || '0')));
    }, ZERO_DECIMAL);
  }, [stakingInfos, tokens, prices]);

  const getStakingItemData = (pubkey: PublicKey) => {
    const stakingItemInfo = stakingInfos.find((item) => {
      return item.pubkey.equals(pubkey);
    });

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
    const sToken = findDataByFilter(tokens, {
      mint: stakingItemInfo?.sTokenMint?.toString(),
    });

    const payoutToken = findDataByFilter(tokens, {
      mint: stakingItemInfo?.vestConfigInfo?.claimableMint.toString(),
    });

    const nextRebaseTime = (() => {
      return stakingItemInfo
        ? stakingItemInfo.rebaseLastTime * 1000 +
            stakingItemInfo.rebaseEpochDuration * 1000
        : 0;
    })();

    const apy = (() => (stakingItemInfo ? stakingItemInfo.apy * 100 : 0))();

    const myShare = (() => {
      if (!stakingItemInfo) {
        return ZERO_DECIMAL;
      }

      if (!balances[sToken?.symbol]) return ZERO_DECIMAL;

      const sBalance = new Decimal(balances[sToken?.symbol]) || ZERO_DECIMAL;

      return sBalance
        .mul(DecimalUtil.fromU64(stakingItemInfo.tokenHolderAmount))
        .div(DecimalUtil.fromU64(stakingItemInfo.sTokenMintSupply))
        .toDecimalPlaces(4, 1);
    })();

    const rewardsPerDay = (() =>
      stakingItemInfo && payoutToken
        ? DecimalUtil.fromString(stakingItemInfo.rewardsPerDay)
            .mul(myShare)
            .div(
              DecimalUtil.fromU64(
                stakingItemInfo.tokenHolderAmount,
                payoutToken.decimals,
              ),
            )
            .toNumber()
        : 0)();

    return {
      stakingInfo: stakingItemInfo,
      stakingModel,
      sToken,
      payoutToken,
      nextRebaseTime,
      apy,
      myShare,
      rewardsPerDay,
    };
  };

  const onStake = async ({ stakingInfo, stakingModel, amount }: IOnStake) => {
    const payoutToken = findDataByFilter(tokens, {
      mint: stakingInfo?.vestConfigInfo?.claimableMint.toString(),
    });

    const amountU64 = DecimalUtil.toU64(
      new Decimal(amount),
      payoutToken?.decimals,
    );

    const [toVTokenTx, stakeAllTx, rebaseTx] = await Promise.all([
      stakingModel.toVToken(amountU64),
      stakingModel.stakeAll(),
      stakingModel.rebase(),
    ]);

    // const { signature } = await toVTokenTx
    //   .combine(stakeAllTx)
    //   .combine(rebaseTx)
    //   .confirm();

    return [toVTokenTx, stakeAllTx, rebaseTx];
  };

  const onUnStake = async ({
    stakingInfo,
    stakingModel,
    amount,
  }: IOnUnStake) => {
    const tokenUn = findDataByFilter(tokens, {
      mint: stakingInfo?.sTokenMint.toString(),
    });

    const payoutToken = findDataByFilter(tokens, {
      mint: stakingInfo?.vestConfigInfo?.claimableMint.toString(),
    });

    const vTokenAmount = new Decimal(amount)
      .mul(
        DecimalUtil.fromU64(
          stakingInfo?.sTokenMintSupply,
          payoutToken?.decimals,
        ),
      )
      .div(
        DecimalUtil.fromU64(
          stakingInfo?.tokenHolderAmount,
          payoutToken?.decimals,
        ),
      )
      .toString();

    const amountU64 = DecimalUtil.toU64(
      new Decimal(vTokenAmount),
      tokenUn?.decimals,
    );

    const { userVestingInfo: userVestingInfoStore } = useUserVestingStore();

    const userVestingInfo = (() => {
      if (userVestingInfoStore && stakingInfo) {
        return userVestingInfoStore[
          stakingInfo?.vestConfigInfo.pubkey.toString()
        ];
      }
      return null;
    })();

    // unstake
    const [unstakeTx, vestAllTx, rebaseTx] = await Promise.all([
      stakingModel.unstake(amountU64),
      stakingModel.vestAll(userVestingInfo, stakingInfo.tokenMint),
      stakingModel.rebase(),
    ]);

    return [unstakeTx, vestAllTx, rebaseTx];
    // const { signature } = await unstakeTx
    //   .combine(vestAllTx)
    //   .combine(rebaseTx)
    //   .confirm();
  };

  return {
    stakingTotalValue,
    stakingInfos,
    getStakingItemData,
    onStake,
    onUnStake,
  } as IStakeResponse;
};
