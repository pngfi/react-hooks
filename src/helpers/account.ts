import type { Layout } from '@solana/buffer-layout';
import type { AccountInfo, MintInfo } from '@solana/spl-token';
import type { Provider } from '@saberhq/solana-contrib';
import {
  AccountLayout,
  u64,
  Token as SPLToken,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Buffer } from 'buffer';
import type { PublicKey as IPublicKey } from '@solana/web3.js';
import {
  PublicKey,
  Keypair,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Connection,
  Transaction,
} from '@solana/web3.js';
import {
  Instruction,
  ResolvedTokenAddressInstruction,
} from '../types/instruction';
import { SYSTEM_PROGRAM_ID } from '../common/constant';

/**
 * Layout with decode/encode types.
 */
export type ITypedLayout<T> = Omit<Layout<T>, 'decode' | 'encode'> & {
  decode: (data: Buffer) => T;
  encode: (data: T, out: Buffer) => number;
};

export type IResolvedTokenAccountInstruction = {
  address: IPublicKey;
} & Instruction;

/**
 * Layout for a TokenAccount.
 */
export const TokenAccountLayout = AccountLayout as ITypedLayout<{
  mint: Buffer;
  owner: Buffer;
  amount: Buffer;
  delegateOption: number;
  delegate: Buffer;
  state: number;
  delegatedAmount: Buffer;
  isNativeOption: number;
  isNative: Buffer;
  closeAuthorityOption: number;
  closeAuthority: Buffer;
}>;

export const createWSOLAccountInstructions = (
  owner: IPublicKey,
  solMint: IPublicKey,
  amountIn: u64,
  rentExemptLamports: number,
): ResolvedTokenAddressInstruction => {
  const tempAccount = new Keypair();

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: owner,
    newAccountPubkey: tempAccount.publicKey,
    lamports: amountIn.toNumber() + rentExemptLamports,
    space: AccountLayout.span,
    programId: TOKEN_PROGRAM_ID,
  });

  const initAccountInstruction = SPLToken.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    solMint,
    tempAccount.publicKey,
    owner,
  );

  const closeWSOLAccountInstruction = SPLToken.createCloseAccountInstruction(
    TOKEN_PROGRAM_ID,
    tempAccount.publicKey,
    owner,
    owner,
    [],
  );

  return {
    address: tempAccount.publicKey,
    instructions: [createAccountInstruction, initAccountInstruction],
    cleanupInstructions: [closeWSOLAccountInstruction],
    signers: [tempAccount],
  };
};

export const deserializeTokenAccount = (
  data: Buffer,
): Omit<AccountInfo, 'address'> => {
  const accountInfo = AccountLayout.decode(data);

  const mint = new PublicKey(accountInfo.mint);
  const owner = new PublicKey(accountInfo.owner);
  const amount = u64.fromBuffer(accountInfo.amount);

  let delegate: IPublicKey | null;
  let delegatedAmount: u64;

  if (accountInfo.delegateOption === 0) {
    delegate = null;
    delegatedAmount = new u64(0);
  } else {
    delegate = new PublicKey(accountInfo.delegate);
    delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  const isInitialized = accountInfo.state !== 0;
  const isFrozen = accountInfo.state === 2;

  let rentExemptReserve: u64 | null;
  let isNative: boolean;

  if (accountInfo.isNativeOption === 1) {
    rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    isNative = true;
  } else {
    rentExemptReserve = null;
    isNative = false;
  }

  let closeAuthority: IPublicKey | null;
  if (accountInfo.closeAuthorityOption === 0) {
    closeAuthority = null;
  } else {
    closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return {
    mint,
    owner,
    amount,
    delegate,
    delegatedAmount,
    isInitialized,
    isFrozen,
    rentExemptReserve,
    isNative,
    closeAuthority,
  };
};

export const createTokenAccount = async ({
  provider,
  mint,
  owner = provider.wallet.publicKey,
  payer = provider.wallet.publicKey,
  accountSigner = Keypair.generate(),
}: {
  provider: Provider;
  mint: IPublicKey;
  owner?: IPublicKey;
  payer?: IPublicKey;
  /**
   * The keypair of the account to be created.
   */
  accountSigner?: Signer;
}): Promise<IResolvedTokenAccountInstruction> => {
  // Allocate memory for the account
  const balanceNeeded = await SPLToken.getMinBalanceRentForExemptAccount(
    provider.connection,
  );

  const tokenAccount = accountSigner.publicKey;

  return {
    address: accountSigner.publicKey,
    instructions: [
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: accountSigner.publicKey,
        lamports: balanceNeeded,
        space: TokenAccountLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
      SPLToken.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mint,
        tokenAccount,
        owner,
      ),
    ],
    cleanupInstructions: [],
    signers: [accountSigner],
  };
};

export async function createTokenMint(
  provider: Provider,
  authority: IPublicKey,
  mint: IPublicKey,
  decimals = 6,
): Promise<Instruction> {
  const instructions = [
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    SPLToken.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint,
      decimals,
      authority,
      null,
    ),
  ];

  return {
    instructions,
    signers: [],
    cleanupInstructions: [],
  };
}

export function createAssociatedTokenAccountInstruction(
  associatedTokenAddress: IPublicKey,
  fundSource: IPublicKey,
  destination: IPublicKey,
  tokenMint: IPublicKey,
  // fundAddressOwner: IPublicKey
): Instruction {
  const keys = [
    {
      pubkey: fundSource,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: destination,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: tokenMint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSTEM_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  const createATAInstruction = new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
  return {
    instructions: [createATAInstruction],
    cleanupInstructions: [],
    signers: [],
  };
}

export const getTokenAccountInfo = async (
  provider: Provider,
  tokenAccount: IPublicKey,
): Promise<Omit<AccountInfo, 'address'> | null> => {
  const assetHolderInfo = await provider.connection.getAccountInfo(
    tokenAccount,
  );
  return assetHolderInfo ? deserializeTokenAccount(assetHolderInfo.data) : null;
};

export const getTokenMintInfo = (
  provider: Provider,
  tokenMint: IPublicKey,
): Promise<MintInfo> => {
  const token = new SPLToken(
    provider.connection,
    tokenMint,
    TOKEN_PROGRAM_ID,
    {} as any,
  );

  return token.getMintInfo();
};

export function transferToken(
  source: IPublicKey,
  destination: IPublicKey,
  amount: u64,
  payer: IPublicKey,
) {
  const instructions = [
    SPLToken.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      source,
      destination,
      payer,
      [],
      amount,
    ),
  ];

  return {
    instructions,
    signers: [],
    cleanupInstructions: [],
  };
}

export const createApprovalInstruction = (
  ownerAddress: IPublicKey,
  approveAmount: u64,
  tokenUserAddress: IPublicKey,
  userTransferAuthority?: Keypair,
): { userTransferAuthority: Keypair } & Instruction => {
  userTransferAuthority = userTransferAuthority || new Keypair();

  const approvalInstruction = SPLToken.createApproveInstruction(
    TOKEN_PROGRAM_ID,
    tokenUserAddress,
    userTransferAuthority.publicKey,
    ownerAddress,
    [],
    approveAmount,
  );

  const revokeInstruction = SPLToken.createRevokeInstruction(
    TOKEN_PROGRAM_ID,
    tokenUserAddress,
    ownerAddress,
    [],
  );

  return {
    userTransferAuthority: userTransferAuthority,
    instructions: [approvalInstruction],
    cleanupInstructions: [revokeInstruction],
    signers: [],
  };
};

export const simulateTransaction = (
  connection: Connection,
  feePayer: IPublicKey,
  instructions: TransactionInstruction[],
  accounts?: IPublicKey[],
  signers?: Signer[],
) => {
  console.log('simulateTransaction', instructions, feePayer, signers, accounts);
  const transaction = new Transaction({ feePayer });
  transaction.add(...instructions);
  return connection.simulateTransaction(transaction, signers, accounts);
};
