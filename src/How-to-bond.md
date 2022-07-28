# How to bond

1. use `useBond` to get bond info

```ts
import {
  useConnection, useWallet
} from '@solana/wallet-adapter-react';
import {
  useAnchorProvider,
  useBond
} from "@pngfi/react-hooks";


const [bondingItemData, setBondingItemData] = useState({} as any);
const { connection } = useConnection();
const { wallet, connected } = useWallet();
const provider = useAnchorProvider({
  connection,
  wallet,
  connected
});

const {
  bondingTotalValue,
  getBondingItemData,
  onBond
} = await useBond(provider);

useEffect(() => {
  async function fetchData() {
    const data = await getBondingItemData(pubkey);
    setBondingItemData(data);
  }
  fetchData();
}, [getBondingItemData, pubkey]);

const {
  bondingModel,
  stakingModel,
  bondingInfo // IBondingInfoWithTokens,

  payoutHolderBalance,
  assetTokens,
} = bondingItemData;
const { publicKey: ownerAccount } = useWallet();
const res = onBond({
  ownerAccount,
  bondingInfo,
  bondingModel,
  stakingModel,

  depositToken,
  amount,

  execute: (opTx, amount, token, isSwap) => {
    // const { signature } = await opTx.confirm();
  },
  swap: () => {
    // const { execute } = await jupAg.exchange({
    //   routeInfo: routes[0]
    // });
    // const swapResult = await execute({
    //   wallet: {
    //     sendTransaction,
    //     publicKey,
    //     signAllTransactions,
    //     signTransaction
    //   }
    // });
  },
  userVestingInfo,
});
```