# [@xweb3/react-hooks](https://npmjs.com/package/@xweb3/react-hooks)

<div align="center">
  <a href="https://www.npmjs.com/package/@xweb3/react-hooks">
    <img src="https://img.shields.io/npm/v/@xweb3/react-hooks.svg?style=flat-square">
  </a>
</div>

## Link

- [How to claim rewards](#how-to-claim-rewards)

## Api Host

- Dev Version https://api-dev.png.fi
- Staging Version https://api-staging.png.fi
- Online Version https://api.png.fi

## react hooks base api

### [[Xweb3Provider]]

```tsx
import { Xweb3Provider } from '@xweb3/react-hooks';

const App = ({ children }) => {
  const wallet = useWallet();
  return (
    <Xweb3Provider
      cluster="mainnet-beta"
      publicKey={wallet.publicKey}
      >
      {/* You can use useBonding in children now */}
      {children}
    </Xweb3Provider>
  )
}
```

### [[usePngfiConfig]]

```ts
import { usePngfiConfig } from '@xweb3/react-hooks';
const {
  fallback: {
    cluster,
    xweb3Api,
    userPublicKey
    //...
  }
  //...
} = usePngfiConfig()
```

### [[useAnchorProvider]]

```ts
import { useAnchorProvider } from '@xweb3/react-hooks';
const provider = useAnchorProvider()
```

## Distributors

### [[useInsertDistributorMerkleRewards]]

```ts
const { data, error, loading }: {
  data: IMerkleRewardsInsertResponse,
  error: IError,
  loading: boolean
} = useInsertDistributorMerkleRewards(options: IMerkleRewardsInsertRequest);
```

### [[useDistributors]]

```ts
import { useDistributors } from '@xweb3/react-hooks';
const { data, error, loading } = useDistributors(user: string);
```

### [[useMerkleRewards]]

```ts
import { useMerkleRewards } from '@xweb3/react-hooks';
const { data, error, loading } = useMerkleRewards(user: string);
```

### [[useDistributorEpochs]]

```ts
import { useDistributorEpochs } from '@xweb3/react-hooks';
const { data, error, loading } = useDistributorEpochs(distributor: string);
```


### [[useMerkleRewardsDistributor]]

```ts
import { useMerkleRewardsDistributor } from '@xweb3/react-hooks';
const { data, error, loading } = useMerkleRewardsDistributor(distributor: string);
```

### [[useDistributorRewardsEpoch]]

```ts
import { useDistributorRewardsEpoch } from '@xweb3/react-hooks';
const { data, error, loading } = useDistributorRewardsEpoch(distributor: string, epoch: string);
```

### [[useTokens]]

```ts
import { useTokens } from '@xweb3/react-hooks';
const { data, error, loading } = useTokens();
```

### [[usePools]]

```ts
import { usePools } from '@xweb3/react-hooks';
const { data, error, loading } = usePools();
```

### [[useMarkets]]

```ts
import { useMarkets } from '@xweb3/react-hooks';
const { data, error, loading } = useMarkets();
```

### [[usePrices]]

```ts
import { usePrices } from '@xweb3/react-hooks';
const { data, error, loading } = usePrices(['SOL', 'UST']);
```
### [[useBonding]]

```ts
import { useBonding } from '@xweb3/react-hooks';
const { data, error, loading } = useBonding();
```

### [[useStaking]]

```ts
import { useStaking } from '@xweb3/react-hooks';
const { data, error, loading } = useStaking();
```

### [[useBalances]]

```ts
import { useBalances } from '@xweb3/react-hooks';
const { data, error, loading } = useBalances(user);
```

### [[useUserVesting]]

```ts
import { useUserVesting } from '@xweb3/react-hooks';
const { data, error, loading } = useUserVesting(owner, vestConfig);
```

### [[useRewards]]

[[include:How-to-claim-rewards.md]]

