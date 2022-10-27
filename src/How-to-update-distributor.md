# How to update distributor

1. use `updateDistributor` to update distributor

```ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProvider, useRewards, useTokenByMint, signAuth } from '@pngfi/react-hooks';
const { publicKey, wallet, connected, signMessage, ISignMessage } = useWallet();
const { connection } = useConnection();
const provider = useAnchorProvider({ connection, wallet, connected });

const { updateDistributor, confirmUpdateDistributor } = useRewards();

const distributor = useDistributor(address);

const token = useTokenByMint(distributor.tokenMint);

const { txe, distributor } = await updateDistributor({
  provider,
  distributor: distributor.address,
  adminAuth: String(publicKey),
  data: {
    "title": title,
    token,
    "rewards": distributors.map(v => {
      return {
        dest: v.distributor,
        amount: v.amount
      }
    })
  }
});
```

2. use `txe.confirm` to confirm sendTransaction

```ts
const { signature, response } = await txe.confirm();
```

3. use `confirmUpdateDistributor` to update distributor status.

```ts
await confirmUpdateDistributor({
    distributor: distributor.distributor,
    previousEpochID: distributor.epochID,
    status: 'SUCCESS', // 'CANCEL', 'ERROR'
}, {
    'X-PNG-SIGNATURE': await signAuth(signMessage, ISignMessage.confirmDistributor),
    'X-PNG-ADDRESS': String(publicKey)
});
```
