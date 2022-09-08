# How to get distributors

1. use `insertDistributor` to insert distributors

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useRewards } from '@pngfi/react-hooks';
const { publicKey } = useWallet();
const { getDistributors } = useRewards();

const txe = await getDistributors(publicKey.toString());
```