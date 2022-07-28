import qs from 'query-string';

import fetcher from './fetcher';

// https://www.coingecko.com/zh/api/documentation
const baseApi = `https://api.coingecko.com/api/v3`;

export const pingApi = `${baseApi}/ping`;
/**
 * Check API server status
 */
export const ping = async () => {
  return await fetcher(pingApi);
};

export type ISimplePrice = {
  ids: string;
  vs_currencies: string;
  include_market_cap?: string;
  include_24hr_vol?: string;
  include_24hr_change?: string;
  include_last_updated_at?: string;
};
export const defaultSimplePriceOptions = {
  ids: `solana`,
  vs_currencies: `usd`,
};
/**
 * Get the current price of any cryptocurrencies in any other supported currencies that you need.
 */
export const simplePriceApi = (
  options: ISimplePrice = defaultSimplePriceOptions,
) => (options.ids ? `${baseApi}/simple/price?${qs.stringify(options)}` : null);
export const simplePrice = async (
  options: ISimplePrice = defaultSimplePriceOptions,
) => {
  return await fetcher(`${simplePriceApi(options)}`);
};

export interface ISimpleTokenPrice {
  id: string;
  contract_addresses: string;
  vs_currencies: string;
  include_market_cap?: string;
  include_24hr_vol?: string;
  include_24hr_change?: string;
  include_last_updated_at?: string;
}
export const simpleTokenPriceApi = (id: string) =>
  `${baseApi}/simple/token_price/${id}`;
/**
 * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
 * @param options
 * @returns
 */
export const simpleTokenPrice = async (options: ISimpleTokenPrice) => {
  return await fetcher(
    `${simpleTokenPriceApi(options.id)}?${qs.stringify(options)}`,
  );
};

export const supportedVsCurrenciesApi = `${baseApi}/simple/supported_vs_currencies`;
/**
 * Get list of supported_vs_currencies.
 */
export const supportedVsCurrencies = async () => {
  return await fetcher(supportedVsCurrenciesApi);
};

export const coinsListApi = `${baseApi}/coins/list`;
/**
 * List all supported coins id, name and symbol (no pagination required)
 */
export const coinsList = async (
  options: {
    include_platform?: boolean;
  } = {
    include_platform: true,
  },
) => {
  return await fetcher(`${coinsListApi}?${qs.stringify(options)}`);
};

export type ICoinsMarkets = {
  vs_currency: string;
  ids?: string;
  category?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
};
export const coinsMarketsApi = (options: ICoinsMarkets) =>
  options.ids ? `${baseApi}/coins/markets?${qs.stringify(options)}` : null;
/**
 * List all supported coins price, market cap, volume, and market related data
 */
export const coinsMarkets = async (options: ICoinsMarkets) => {
  return await fetcher(`${coinsMarketsApi(options)}`);
};

export const coinsIdApi = (id: string) =>
  id ? `${baseApi}/coins/${id}` : null;
/**
 * Get current data (name, price, market, ... including exchange tickers) for a coin
 */
export const coinsId = async (options: {
  id: string;
  localization?: string;
  tickers?: boolean;
  market_data?: boolean;
  community_data?: boolean;
  developer_data?: boolean;
  sparkline?: boolean;
}) => {
  return await fetcher(`${coinsIdApi(options.id)}?${qs.stringify(options)}`);
};

export const coinsIdTickersApi = (id: string) =>
  id ? `${baseApi}/coins/${id}/tickers` : null;
/**
 * Get coin tickers (paginated to 100 items)
 */
export const coinsIdTickers = async (options: {
  id: string;
  exchange_ids?: string;
  include_exchange_logo?: string;
  page?: number;
  order?: string;
  depth?: string;
}) => {
  return await fetcher(
    `${coinsIdTickersApi(options.id)}?${qs.stringify(options)}`,
  );
};

export const coinsIdHistoryApi = (id: string) =>
  id ? `${baseApi}/coins/${id}/history` : null;
/**
 * Get historical data (name, price, market, stats) at a given date for a coin
 */
export const coinsIdHistory = async (options: {
  id: string;
  date: string;
  localization?: string;
}) => {
  return await fetcher(
    `${coinsIdHistoryApi(options.id)}?${qs.stringify(options)}`,
  );
};

export type ICoinsIdMarketChart = {
  id: string;
  vs_currency: string;
  days: string;
  interval?: string;
};
export const coinsIdMarketChartApi = (options: ICoinsIdMarketChart) =>
  options.id
    ? `${baseApi}/coins/${options.id}/market_chart?${qs.stringify(options)}`
    : null;
/**
 * Get historical market data include price, market cap, and 24h volume (granularity auto)
 */
export const coinsIdMarketChart = async (options: ICoinsIdMarketChart) => {
  return await fetcher(`${coinsIdMarketChartApi(options)}`);
};

export const coinsIdMarketChartRangeApi = (id: string) =>
  id ? `${baseApi}/coins/${id}/market_chart/range` : null;
/**
 * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
 */
export const coinsIdMarketChartRange = async (options: {
  id: string;
  vs_currency: string;
  from: string;
  to: string;
}) => {
  return await fetcher(
    `${coinsIdMarketChartRangeApi(options.id)}?${qs.stringify(options)}`,
  );
};

export const coinsIdOhlcApi = (id: string) =>
  id ? `${baseApi}/coins/${id}/ohlc` : null;
/**
 * Get coin's OHLC
 */
export const coinsIdOhlc = async (options: {
  id: string;
  vs_currency: string;
  days: string;
}) => {
  return await fetcher(
    `${coinsIdOhlcApi(options.id)}?${qs.stringify(options)}`,
  );
};

/**
ping


GET
​/ping
Check API server status
simple


GET
​/simple/price
Get the current price of any cryptocurrencies in any other supported currencies that you need.

GET
​/simple/token_price/{id}
Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.

GET
​/simple/supported_vs_currencies
Get list of supported_vs_currencies.
coins


GET
​/coins​/list
List all supported coins id, name and symbol (no pagination required)

GET
​/coins​/markets
List all supported coins price, market cap, volume, and market related data

GET
​/coins​/{id}
Get current data (name, price, market, ... including exchange tickers) for a coin

GET
​/coins​/{id}​/tickers
Get coin tickers (paginated to 100 items)

GET
​/coins​/{id}​/history
Get historical data (name, price, market, stats) at a given date for a coin

GET
​/coins​/{id}​/market_chart
Get historical market data include price, market cap, and 24h volume (granularity auto)

GET
​/coins​/{id}​/market_chart​/range
Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)

GET
​/coins​/{id}​/ohlc
Get coin's OHLC


contract


GET
​/coins​/{id}​/contract​/{contract_address}
Get coin info from contract address

GET
​/coins​/{id}​/contract​/{contract_address}​/market_chart​/
Get historical market data include price, market cap, and 24h volume (granularity auto) from a contract address

GET
​/coins​/{id}​/contract​/{contract_address}​/market_chart​/range
Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto) from a contract address
asset_platforms


GET
​/asset_platforms
List all asset platforms (Blockchain networks)
categories


GET
​/coins​/categories​/list
List all categories

GET
​/coins​/categories
List all categories with market data
exchanges


GET
​/exchanges
List all exchanges

GET
​/exchanges​/list
List all supported markets id and name (no pagination required)

GET
​/exchanges​/{id}
Get exchange volume in BTC and top 100 tickers only

GET
​/exchanges​/{id}​/tickers
Get exchange tickers (paginated, 100 tickers per page)

GET
​/exchanges​/{id}​/volume_chart
Get volume_chart data for a given exchange
indexes


GET
​/indexes
List all market indexes

GET
​/indexes​/{market_id}​/{id}
get market index by market id and index id

GET
​/indexes​/list
list market indexes id and name
derivatives


GET
​/derivatives
List all derivative tickers

GET
​/derivatives​/exchanges
List all derivative exchanges

GET
​/derivatives​/exchanges​/{id}
show derivative exchange data

GET
​/derivatives​/exchanges​/list
List all derivative exchanges name and identifier
exchange_rates


GET
​/exchange_rates
Get BTC-to-Currency exchange rates
search


GET
​/search
Search for coins, categories and markets on CoinGecko
trending


GET
​/search​/trending
Get trending search coins (Top-7) on CoinGecko in the last 24 hours
global


GET
​/global
Get cryptocurrency global data

GET
​/global​/decentralized_finance_defi
Get cryptocurrency global decentralized finance(defi) data
companies (beta)


GET
​/companies​/public_treasury​/{coin_id}
Get public companies data
*/
