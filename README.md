# [@pngfi/react-hooks](https://npmjs.com/package/@pngfi/react-hooks)

<div align="center">
  <a href="https://www.npmjs.com/package/@pngfi/react-hooks">
    <img src="https://img.shields.io/npm/v/@pngfi/react-hooks.svg?style=flat-square">
  </a>
</div>

## Link

- [How to claim rewards](#how-to-claim-rewards)

## Api Host

- Dev Version https://api-dev.png.fi
- Staging Version https://api-staging.png.fi
- Online Version https://api.png.fi

## react hooks base api

### [[PngfiProvider]]

```tsx
import { PngfiProvider } from '@pngfi/react-hooks';

const App = ({ children }) => {
  const wallet = useWallet();
  return (
    <PngfiProvider
      cluster="mainnet-beta"
      publicKey={wallet.publicKey}
      >
      {/* You can use useBonding in children now */}
      {children}
    </PngfiProvider>
  )
}
```

### [[usePngfiConfig]]

```ts
import { usePngfiConfig } from '@pngfi/react-hooks';
const {
  fallback: {
    cluster,
    pngfiApi,
    userPublicKey
    //...
  }
  //...
} = usePngfiConfig()
```

### [[useAnchorProvider]]

```ts
import { useAnchorProvider } from '@pngfi/react-hooks';
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
import { useDistributors } from '@pngfi/react-hooks';
const { data, error, loading } = useDistributors(user: string);
```

### [[useMerkleRewards]]

```ts
import { useMerkleRewards } from '@pngfi/react-hooks';
const { data, error, loading } = useMerkleRewards(user: string);
```

### [[useDistributorEpochs]]

```ts
import { useDistributorEpochs } from '@pngfi/react-hooks';
const { data, error, loading } = useDistributorEpochs(distributor: string);
```


### [[useMerkleRewardsDistributor]]

```ts
import { useMerkleRewardsDistributor } from '@pngfi/react-hooks';
const { data, error, loading } = useMerkleRewardsDistributor(distributor: string);
```

### [[useDistributorRewardsEpoch]]

```ts
import { useDistributorRewardsEpoch } from '@pngfi/react-hooks';
const { data, error, loading } = useDistributorRewardsEpoch(distributor: string, epoch: string);
```

### [[useTokens]]

```ts
import { useTokens } from '@pngfi/react-hooks';
const { data, error, loading } = useTokens();
```

### [[usePools]]

```ts
import { usePools } from '@pngfi/react-hooks';
const { data, error, loading } = usePools();
```

### [[useMarkets]]

```ts
import { useMarkets } from '@pngfi/react-hooks';
const { data, error, loading } = useMarkets();
```

### [[usePrices]]

```ts
import { usePrices } from '@pngfi/react-hooks';
const { data, error, loading } = usePrices(['SOL', 'UST']);
```
### [[useBonding]]

```ts
import { useBonding } from '@pngfi/react-hooks';
const { data, error, loading } = useBonding();
```

### [[useStaking]]

```ts
import { useStaking } from '@pngfi/react-hooks';
const { data, error, loading } = useStaking();
```

### [[useBalances]]

```ts
import { useBalances } from '@pngfi/react-hooks';
const { data, error, loading } = useBalances(user);
```

### [[useUserVesting]]

```ts
import { useUserVesting } from '@pngfi/react-hooks';
const { data, error, loading } = useUserVesting(owner, vestConfig);
```

### [[useRewards]]

[[include:How-to-claim-rewards.md]]

