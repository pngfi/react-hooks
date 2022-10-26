# How to update distributor

1. use `updateDistributor` to update distributor

```ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProvider, useRewards, signAuth } from '@pngfi/react-hooks';
const { publicKey, wallet, connected } = useWallet();
const { connection } = useConnection();
const provider = useAnchorProvider({ connection, wallet, connected });

const { updateDistributor, confirmUpdateDistributor } = useRewards();

const distributor = useDistributor(address);

const txe = await updateDistributor({
  provider,
  distributor: distributor.address,
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
    distributor: distributorAddress,
    previousEpochID: distributor.epochID,
    status: 'SUCCESS', // 'CANCEL', 'ERROR'
}, {
    'X-PNG-SIGNATURE': signAuth(wallet, 'Update Distributor'),
    'X-PNG-ADDRESS': publicKey.toString()
});
```