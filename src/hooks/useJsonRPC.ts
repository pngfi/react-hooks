import { rpcpoolApi } from '../common/base';
import fetcher from '../common/fetcher';
import { IRPCRequest, IRPCResponse } from '../types/solana-rpc';

const rpcApi = `${rpcpoolApi()}`;

/**
 * [Solana JSON RPC API ](https://docs.solana.com/developing/clients/jsonrpc-api#methods)
 * 
 * @param {IRPCRequest} options
 * @returns Promise<IRPCResponse>
 * 
 * @example
 * ```ts
 * const { id, result } = useJsonRPC({
 *    "method":"getLatestBlockhash",
 *    "jsonrpc":"2.0",
 *    "params":[{
 *        "commitment":"confirmed"
 *    }],
 *    "id":"952c496d-dd14-4de3-8fca-d268d36c66dc"
 * });
 * ```
 */
export const useJsonRPC = async (options: IRPCRequest): Promise<IRPCResponse> => {
  return await fetcher(rpcApi, {
    method: 'POST',
    data: options
  });
}