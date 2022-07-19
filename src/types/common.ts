export type IGlobalInfo = {
  walletName: string;
  slippage: number;
};

export type IMessage = {
  duration?: number;
  doNotAutoRemove?: boolean;
  title: string;
  description: string;
  status: 'success' | 'error' | 'info' | 'loading';
  link?: string;
};

export type ITransaction = {
  hash: string;
  status: 'success' | 'error' | 'loading';
  summary: string;
  addedTime: number;
  from: string;
};

export type IFeeStructure = {
  tradeFeeNumerator: number;
  tradeFeeDenominator: number;
  ownerTradeFeeNumerator: number;
  ownerTradeFeeDenominator: number;
  ownerWithdrawFeeNumerator: number;
  ownerWithdrawFeeDenominator: number;
};
