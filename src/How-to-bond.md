# How to claim bond

1. use `useBonding` to get bondings

```ts
const provider = useAnchorProvider();

import {
  useBonding,
  toBondingInfo,
  Bonding
} from "@pngfi/react-hooks";
const { data: bondings = [] } = useBonding();

const bondingInfo = useMemo(() => {
  return bondings.map(v => toBondingInfo(v));
}, [bondingInfo]);

const bondingModel = useMemo(() => {
  return new Bonding(provider as Provider, {
    address: bondingInfo.pubkey
  }, bondingInfo);
}, [bondingInfo, provider]);


```