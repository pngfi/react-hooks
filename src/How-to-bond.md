# How to claim bond

1. use `useBonding` to get bondings

```ts
const provider = useAnchorProvider();

import {
  useBonding,
  useAnchorProvider,
  toBondingInfo,
  Bonding
} from "@pngfi/react-hooks";
const { data: bondings = [] } = useBonding();

const bondingInfo = useMemo(() => {
  return bondings.map(v => toBondingInfo(v));
}, [bondingInfo]);


const { connection } = useConnection();
const { wallet, connected } = useWallet();
const provider = useAnchorProvider({
  connection,
  wallet,
  connected
});

const bondingModel = useMemo(() => {
  return new Bonding(provider as Provider, {
    address: bondingInfo.pubkey
  }, bondingInfo);
}, [bondingInfo, provider]);

const stakingModel = useMemo(() => {
  return new Staking(provider as Provider, {
    address: stakingInfo?.pubkey,
    vestConfig: stakingInfo?.vestConfigInfo.pubkey
  }, stakingInfo);
}, [stakingInfo, provider]);

```