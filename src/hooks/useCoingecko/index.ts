import qs from 'query-string';
import {
  coinsIdMarketChartApi,
  coinsMarketsApi,
  ICoinsIdMarketChart,
  ISimpleTokenPrice,
  simplePriceApi,
  simpleTokenPriceApi,
} from '../../common/coingecko-api';
import { useFetcher } from '../../common/fetcher';

/**
 * Get the current price of any cryptocurrencies in any other supported currencies that you need.
 */
export const useSimplePrice = (
  coingeckoId: string | string[],
  vs_currencies: string | string[] = 'usd',
) => {
  return useFetcher(
    simplePriceApi({
      ids:
        typeof coingeckoId === 'string' ? coingeckoId : coingeckoId.join(','),
      vs_currencies:
        typeof vs_currencies === 'string'
          ? vs_currencies
          : vs_currencies.join(','),
    }),
  );
};

/**
 * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
 */
export const useSimpleTokenPrice = (options: ISimpleTokenPrice) => {
  return useFetcher(
    `${simpleTokenPriceApi(options.id)}?${qs.stringify(options)}`,
  );
};

/**
 * List all supported coins price, market cap, volume, and market related data
 */
export const useCoinsMarkets = (
  coingeckoId: string | string[],
  vsCurrency = 'usd',
) => {
  return useFetcher(
    coinsMarketsApi({
      ids:
        typeof coingeckoId === 'string' ? coingeckoId : coingeckoId.join(','),
      vs_currency: vsCurrency,
    }),
  );
};

/**
 * Get historical market data include price, market cap, and 24h volume (granularity auto)
 */
export const useCoinsIdMarketChart = (options: ICoinsIdMarketChart) => {
  return useFetcher(coinsIdMarketChartApi(options));
};
