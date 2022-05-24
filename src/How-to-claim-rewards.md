# How to claim rewards

1. use `useMerkleRewards` to get rewards

```ts
import {
  useMerkleRewards,
  useUserPublicKey
} from "@pngfi/react-hooks";
const userPublicKey = useUserPublicKey() || ''
const { data = [] } = useMerkleRewards(userPublicKey.toString());
```

2. use `claimRewards` to claim rewards

```ts
import {
  useConnection, useWallet
} from '@solana/wallet-adapter-react';
import {
  useAnchorProvider,
  useRewards,
  useUserPublicKey
} from "@pngfi/react-hooks";

const { connection } = useConnection();
const { wallet, connected } = useWallet();

const { claimRewards } = useRewards();
const provider = useAnchorProvider({
  connection,
  wallet,
  connected
});
const publicKey = useUserPublicKey();

const onClaim = async (data) => {
  try {
    const claimTx = await claimRewards(provider, publicKey, {
      distributor: data.distributor,
      amount: data.amount.toString(),
      claimAddress: data.claimAddress || '',
      proof: data.proof,
      mint: data.mint,
      index: data.index,
    });
    console.log('claimTx', claimTx);

    const { signature } = await claimTx.confirm();
    console.log('claimTx result', signature);

  } catch (e) {
    console.log('e', e);
  }
}

// ...

onClaim(item) // item of useMerkleRewards data
```