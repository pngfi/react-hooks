# How to delete distributor

1. use `deleteDistributor` to delete distributor

```ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useRewards, signAuth } from '@pngfi/react-hooks';
const { publicKey, signMessage } = useWallet();

const { deleteDistributor } = useRewards();

const result = await deleteDistributor((distributor.address, {
    'X-PNG-SIGNATURE': await signAuth(signMessage, 'Delete Distributor'),
    'X-PNG-ADDRESS': String(publicKey)
}));
```
