import { rpcpoolApi } from './base';
import fetcher from './fetcher';
import { IRPCRequest, IRPCResponse } from '../types/solana-rpc';

const rpcApi = `${rpcpoolApi()}`;
export const getJsonRPCData = async (
  options: IRPCRequest,
): Promise<IRPCResponse> => {
  return await fetcher(rpcApi, {
    method: 'POST',
    data: options,
  });
};
