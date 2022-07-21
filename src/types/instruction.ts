import {
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import type { PublicKey as IPublicKey } from '@solana/web3.js';

export declare interface Instruction {
  instructions: TransactionInstruction[];
  cleanupInstructions: TransactionInstruction[];
  signers: Signer[];
}
export declare type ResolvedTokenAddressInstruction = Instruction & {
  address: IPublicKey;
};

export const emptyInstruction: Instruction = {
  instructions: [],
  cleanupInstructions: [],
  signers: [],
};
export declare interface TransactionPayload {
  transaction: Transaction;
  signers: Signer[];
  execute: () => Promise<TransactionSignature>;
}
