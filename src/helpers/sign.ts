import { WalletContextState } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

export const signAuth = async (wallet: WalletContextState, message: string) => {
  if (!wallet?.signMessage) {
    throw new Error('wallet.signMessage is undefined');
  }
  return bs58.encode(
    await wallet.signMessage(new TextEncoder().encode(message))
  );
};
