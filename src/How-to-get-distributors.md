# How to get distributors

1. use `useDistributors` to get distributors

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useDistributors } from '@pngfi/react-hooks';
const { publicKey } = useWallet();

const { data, loading, error } = await useDistributors(publicKey.toString());
```