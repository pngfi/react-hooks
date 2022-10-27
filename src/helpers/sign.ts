import { MessageSignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import bs58 from 'bs58';

export const signAuth = async (
  signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined,
  message: string,
) => {
  if (!signMessage) {
    throw new Error('signMessage is undefined');
  }
  return bs58.encode(await signMessage(new TextEncoder().encode(message)));
};
