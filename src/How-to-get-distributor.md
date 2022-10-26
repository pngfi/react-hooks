# How to get distributor

### use `useDistributors` to get distributors

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useDistributors } from '@pngfi/react-hooks';
const { publicKey } = useWallet();

const { data, loading, error } = await useDistributors(publicKey.toString());
```

### use `useDistributor` to get distributor

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useDistributor } from '@pngfi/react-hooks';

const { data, loading, error } = await useDistributor(distributorAddress);
```