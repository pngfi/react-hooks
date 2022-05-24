import Decimal from 'decimal.js';

import { ITokenInfo } from "./token";

export interface IMerkleRewards {
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
  dest: string,  
  /**
   * DecimalUtil.toU64
   */
  amount: string  
}

export interface IMerkleRewardsInsertRequest {
  /**
   * A string to identify the project using this. For now, use your token symbol.
   */
  projectID: ITokenInfo['symbol'];
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
  base: string;
  /**
   * A unique ID to indicate a particular merkle tree update. Repeated POST using the same epochID is idempotent.
   * await connection.getEpochInfo()
   */
  epochID: number;
  /**
   * PublicKey;
   * (base58 pubkey) The account key that should sign the merkle tree insert
   */
  adminAuth: string;
  /**
   * The reward type for this merkle tree.
   */
  mint: ITokenInfo['mint'];
}

export interface IMerkleRewardsInsertResponse {
  /**
   * Dex string of the merkle root
   */
  merkleRoot: string;
  /**
   * (base58 pubkey) Distributor state PDA derived from the `base` pubkey.
   */
  distributor: string;
  /**
   * The transaction you should sign & submit
   * serialized hex string of transaction
   */
  tx: string;
}

export declare interface IMerkleDistributorItem {
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
  /**
   * hex array
   */
  proof: string[];
};

export type IDistributorType = {
  updatedAt: number;
  createdAt: number;
  title: string;
  tokenHolder: string;
  tokenMint: string;
  totalAmount: string;
  distributor: string;
}

// export declare interface IMerkleRewards2 {
//   amount: string;
//   dest: string;
//   distributor: string;
//   index: number;
//   merkleRoot: string;
//   mint: string;
//   proof: string[]; // hex array
//   title: string;
//   tokenHolder: string;
//   unclaimed: string;
//   updatedAt: number;
// };

export declare type IMerkleDistributorInfo = IMerkleDistributorItem & {
  token: ITokenInfo;
  leftAmount?: Decimal,
  rewardTime?: string,
  nextRewardTime?: string,
  isCommon?: boolean,
  amount: string;
};
