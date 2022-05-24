export declare type IEncoding = "base58" | "base64" | "base64+zstd" | "jsonParsed";

export type IBaseMethod =
  /**
   * https://docs.solana.com/developing/clients/jsonrpc-api#getaccountinfo
   */
  "getAccountInfo" |
  /**
   * https://docs.solana.com/developing/clients/jsonrpc-api#getbalance
   */
  "getBalance" |
  "getBlock" |
  "getBlockHeight" |
  "getBlockProduction" |
  "getBlockCommitment" |
  "getBlocks" |
  "getBlocksWithLimit" |
  "getBlockTime" |
  "getClusterNodes" |
  "getEpochInfo" |
  "getEpochSchedule" |
  "getFeeCalculatorForBlockhash" |
  "getFeeRateGovernor" |
  "getFees" |
  "getFirstAvailableBlock" |
  "getGenesisHash" |
  "getHealth" |
  "getIdentity" |
  "getInflationGovernor" |
  "getInflationRate" |
  "getInflationReward" |
  "getLargestAccounts" |
  "getLeaderSchedule" |
  "getMaxRetransmitSlot" |
  "getMaxShredInsertSlot" |
  "getMinimumBalanceForRentExemption" |
  "getMultipleAccounts" |
  "getProgramAccounts" |
  "getRecentBlockhash" |
  "getRecentPerformanceSamples" |
  "getSnapshotSlot" |
  "getSignaturesForAddress" |
  "getSignatureStatuses" |
  "getSlot" |
  "getSlotLeader" |
  "getSlotLeaders" |
  "getStakeActivation" |
  "getSupply" |
  "getTokenAccountBalance" |
  "getTokenAccountsByDelegate" |
  "getTokenAccountsByOwner" |
  "getTokenLargestAccounts" |
  "getTokenSupply" |
  "getTransaction" |
  "getTransactionCount" |
  "getVersion" |
  "getVoteAccounts" |
  "minimumLedgerSlot" |
  "requestAirdrop" |
  "sendTransaction" |
  "simulateTransaction"

export type ISubscriptionWebsocket =
  "accountSubscribe" |
  "accountUnsubscribe" |
  "logsSubscribe" |
  "logsUnsubscribe" |
  "programSubscribe" |
  "programUnsubscribe" |
  "signatureSubscribe" |
  "signatureUnsubscribe" |
  "slotSubscribe" |
  "slotUnsubscribe";

export type IUnstableMethods =
  "blockSubscribe" |
  "blockUnsubscribe" |
  "slotsUpdatesSubscribe" |
  "slotsUpdatesUnsubscribe" |
  "voteSubscribe" |
  "voteUnsubscribe";


export type IDeprecatedMethods =
  "getConfirmedBlock" |
  "getConfirmedBlocks" |
  "getConfirmedBlocksWithLimit" |
  "getConfirmedSignaturesForAddress2" |
  "getConfirmedTransaction" |
  "getFeeCalculatorForBlockhash" |
  "getFeeRateGovernor" |
  "getFees" |
  "getRecentBlockhash" |
  "getSnapshotSlot";

export interface IRPCRequest {
  jsonrpc: '2.0';
  id: number;
  /**
   * [Solana RPC API method](https://docs.solana.com/developing/clients/jsonrpc-api#methods)
   */
  method: IBaseMethod | ISubscriptionWebsocket | IUnstableMethods | IDeprecatedMethods;
  /**
   * [Solana RPC API params for method](https://docs.solana.com/developing/clients/jsonrpc-api#methods)
   */
  params: string | number[] | any[];
}

export interface IRPCResponse {
  jsonrpc: "2.0";
  /**
   * [Solana RPC API result](https://docs.solana.com/developing/clients/jsonrpc-api#methods)
   */
  result: any;
  id: number;
}