# How to create distributors

1. use `insertDistributor` to insert distributors

```ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProvider, useRewards } from '@pngfi/react-hooks';
const { publicKey, wallet, connected } = useWallet();
const { connection } = useConnection();
const provider = useAnchorProvider({ connection, wallet, connected });

const { insertDistributor } = useRewards();

const txe = await insertDistributor({
  provider,
  adminAuth: publicKey as PublicKey,
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

2. use `confirm` to confirm sendTransaction

```ts
const { signature, response } = await txe.confirm();
```