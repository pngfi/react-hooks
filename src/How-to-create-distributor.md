# How to create distributor

1. use `insertDistributor` to insert distributor

```ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProvider, useRewards, useTokenByMint, signAuth, ISignMessage } from '@pngfi/react-hooks';
import { Keypair } from '@solana/web3.js';

const { publicKey, wallet, connected, signMessage } = useWallet();
const { connection } = useConnection();
const provider = useAnchorProvider({ connection, wallet, connected });

const { insertDistributor, confirmInsertDistributor } = useRewards();

const token = useTokenByMint(tokenMint);

const { txe, distributor } = await insertDistributor({
  provider,
  base: Keypair.generate().publicKey.toString(),
  adminAuth: publicKey.toString(),
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

3. use `confirmInsertDistributor` to update distributor status.

```ts
await confirmInsertDistributor({
    distributor: distributor.distributor,
    status: 'SUCCESS', // 'CANCEL', 'ERROR'
}, {
    'X-PNG-SIGNATURE': await signAuth(signMessage, ISignMessage.confirmDistributor),
    'X-PNG-ADDRESS': publicKey.toString()
});
```
