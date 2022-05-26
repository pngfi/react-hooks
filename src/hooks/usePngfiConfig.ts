/**
 * global configs for @pngfi/react-hooks
 * 
 * @returns IPngfiProvider
 * 
 * @example
 * ```ts
 * const {
 *   fallback: {
 *     connection,
 *     cluster,
 *     pngfiApi,
 *     userPublicKey
 *    //...
 *   }
 * //...
 * } = usePngfiConfig()
 * ```
 */
export { useSWRConfig as usePngfiConfig } from 'swr';