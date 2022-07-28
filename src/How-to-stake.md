# How to stake

1. use `useStake` to get stake info

```ts
import {
  useConnection, useWallet
} from '@solana/wallet-adapter-react';
import {
  useAnchorProvider,
  useStake
} from "@pngfi/react-hooks";

const { connection } = useConnection();
const { publicKey, wallet, connected } = useWallet();
const provider = useAnchorProvider({
  connection,
  wallet,
  connected
});

const {
  stakingTotalValue,
  getStakingItemData,
  onStake,
  onUnStake
} = useStake(provider);

const {
  stakingInfo,
  stakingModel,
  // ...
} = getStakingItemData();

// stake
const [toVTokenTx, stakeAllTx, rebaseTx] = await onStake({
  stakingInfo,
  stakingModel,
  amount,
});

const { signature } = await toVTokenTx
  .combine(stakeAllTx)
  .combine(rebaseTx)
  .confirm();

// unstake
const [unstakeTx, vestAllTx, rebaseTx] = await onUnStake({
  stakingInfo,
  stakingModel,
  amount,
});
const { signature } = await unstakeTx
    .combine(vestAllTx)
    .combine(rebaseTx)
    .confirm();
```