import { useMemo } from 'react';
import {
  DEFAULT_PROVIDER_OPTIONS,
  SolanaAugmentedProvider,
  SolanaProvider,
  SolanaReadonlyProvider,
  Provider,
} from '@saberhq/solana-contrib';
import { Wallet } from '@solana/wallet-adapter-react';
import { SOLANA_COMMITMENT } from '../common/constant';
import { Connection } from '@solana/web3.js';

export interface IAnchorProvider {
  connection: Connection,
  wallet: Wallet | null,
  connected: boolean
}

/**
 * solana provider
 * 
 * @param { IAnchorProvider } options
 * @returns Provider
 * @example
 * ```ts
const { connection } = useConnection();
const { wallet, connected } = useWallet();
const provider = useAnchorProvider({
  connection,
  wallet,
  connected
})
 * ```
 */
export function useAnchorProvider({
  connection,
  wallet,
  connected
}: IAnchorProvider): Provider {
  const provider = useMemo(() =>
    wallet && connected ?
      new SolanaAugmentedProvider(
        SolanaProvider.init({
          connection,
          wallet: wallet.adapter as any,
          opts: DEFAULT_PROVIDER_OPTIONS,
        })
      ) :
      new SolanaReadonlyProvider(connection, {
        commitment: SOLANA_COMMITMENT,
      }),
    [wallet, connected, connection]
  );

  return provider as Provider;
}
