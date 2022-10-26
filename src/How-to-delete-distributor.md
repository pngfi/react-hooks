# How to delete distributor

1. use `deleteDistributor` to delete distributor

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useRewards, signAuth } from '@pngfi/react-hooks';
const { publicKey, wallet } = useWallet();

const { deleteDistributor } = useRewards();

const result = await deleteDistributor((distributor.address, {
    'X-PNG-SIGNATURE': signAuth(wallet, 'Delete Distributor'),
    'X-PNG-ADDRESS': publicKey.toString()
}));
```
