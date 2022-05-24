/**
 * global configs for @xweb3/react-hooks
 * 
 * @returns IXweb3Provider
 * 
 * @example
 * ```ts
const {
  fallback: {
    cluster,
    xweb3Api,
    userPublicKey
    //...
  }
  //...
} = usePngfiConfig()
 * ```
 */
export { useSWRConfig as usePngfiConfig } from 'swr';