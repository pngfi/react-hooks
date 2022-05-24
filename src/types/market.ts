export interface IMarket {
  data: [string, string],
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  pubkey: string;
}