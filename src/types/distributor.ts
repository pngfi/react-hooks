import Decimal from 'decimal.js';

import { IToken } from './token';

export interface IMerkleRewardsResponse {
  distributor: string;
  dest: string;
  proof: string[];
  index: number;
  amount: string;
  unclaimed: string;
  merkleRoot: string;
  title: string;
  mint: string;
  tokenHolder: string;
  updatedAt: number;
}
export interface IMerkleRewardsDistributor {
  epochID: string;
  merkleRoot: string;
  base: string;
  distributor: string;
  rewards: IRewards[];
}

export interface IRewards {
  /**
   * address
   */
  dest: string;
  /**
   * DecimalUtil.toU64
   */
  amount: string;
}

export interface IConfirmHeader {
  'X-PNG-SIGNATURE': string;
  'X-PNG-ADDRESS': string;
}

export const IConfirmStatus = {
  CANCEL: -3,
  ERROR: -2,
  SUCCESS: 1,
};

export interface IDistributorConfirm {
  distributor: string;
  // address: string;
  epochID?: string;
  status: number;
}

export interface IConfirmDistributor {
  /**
   * distributor address
   */
  distributor: string;
  /**
   * 'CANCEL' -3 cancel
   * 'ERROR' -2 error
   * 'SUCCESS' 1 success
   * 'CHAIN_SUCCESS' 2 online confirm success
   */
  status: 'CANCEL' | 'ERROR' | 'SUCCESS';
}

export type IConfirmUpdateDistributor = {
  /**
   * Previous epochID
   */
  previousEpochID: string;
} & IConfirmDistributor;

export interface IMerkleRewardsInsertRequest {
  /**
   * A string to identify the project using this. For now, use your token symbol.
   */
  projectID?: IToken['symbol'];
  /**
   * Describes what the rewards. Display in the rewards caiming UI.
   */
  title: string;
  /**
   * List of rewards to be included in the update. For each update, the amount would be added to the existing amount. The destination address is the owner address of token accounts, not the associated token account addresses.
   */
  rewards: IRewards[];
  /**
   * PublicKey;
   * (base58 pubkey) An account key for storing the merkle tree rewards state. You need to have this secert key to initialize the on-chain sate.
   */
  base?: string;
  /**
   * PublicKey;
   * distributor address
   */
  distributor?: string;
  /**
   * A unique ID to indicate a particular merkle tree update. Repeated POST using the same epochID is idempotent.
   * await connection.getEpochInfo()
   */
  epochID: number;
  /**
   * PublicKey;
   * (base58 pubkey) The account key that should sign the merkle tree insert
   */
  adminAuth?: string;
  /**
   * The reward type for this merkle tree.
   */
  mint?: IToken['mint'];
}

export interface IMerkleRewardsInsertResponse {
  /**
   * Dex string of the merkle root
   */
  merkleRoot: string;
  /**
   * A unique ID to indicate a particular merkle tree update. Repeated POST using the same epochID is idempotent.
   * await connection.getEpochInfo()
   */
  epochID: number;
  /**
   * (base58 pubkey) Distributor state PDA derived from the `base` pubkey.
   */
  distributor: string;
  totalAmount: string;
  /**
   * The transaction you should sign & submit
   * serialized hex string of transaction
   */
  tx: string;
}

export declare interface IMerkleDistributorItem {
  // address: string;
  distributor: string;
  /**
   * UI can check whether this exists or not
   */
  claimAddress: string;
  owner: string;
  index: number;
  mint: string;
  amount: string;
  campaignID: string;
  campaignName: string;
  createdAt: string; // timestamp
  proofs: string[]; // hex array
}

export declare type IDistributorResponse = {
  title: string;
  projectID?: string;
  epochID: string;
  address: string;
  base?: string;
  owner: string;
  tokenMint: string;
  tokenHolder: string;
  totalAmount: string;
  createdAt?: number;
  updatedAt?: number;
  beneficiaries?: string[];
};

export declare type IMerkleDistributorInfo = IMerkleDistributorItem & {
  token: IToken;
  leftAmount?: Decimal;
  rewardTime?: string;
  nextRewardTime?: string;
  isCommon?: boolean;
  amountStr: string;
};
