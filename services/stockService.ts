import { CandleData, StockQuote, TimeRange } from '../types';

// Mock Data Generator
const generateMockCandles = (count: number, startPrice: number): CandleData[] => {
  const candles: CandleData[] = [];
  let currentPrice = startPrice;
  const now = Date.now();
  const oneDay = 86400 * 1000;

  for (let i = count; i > 0; i--) {
    const time = now - i * oneDay;
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 1000000) + 50000;

    candles.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      dateStr: new Date(time).toLocaleDateString('zh-TW'),
    });
    currentPrice = close;
  }
  return candles;
};

// Real API Fetcher
const fetchRealCandles = async (symbol: string, range: TimeRange, apiKey: string): Promise<CandleData[]> => {
  // Mapping resolution: 1D -> 5, 1M -> 60, 1Y -> D (Finnhub conventions roughly)
  let resolution = 'D';
  let from = Math.floor(Date.now() / 1000) - 31536000; // 1 year ago default
  const to = Math.floor(Date.now() / 1000);

  if (range === TimeRange.DAY) {
    resolution = '15'; 
    from = to - 86400 * 2; // Last 2 days to ensure data
  } else if (range === TimeRange.MONTH) {
    resolution = '60';
    from = to - 2592000;
  }

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.s === 'ok') {
      return data.t.map((timestamp: number, index: number) => ({
        time: timestamp * 1000,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
        dateStr: new Date(timestamp * 1000).toLocaleDateString('zh-TW'),
      }));
    }
    throw new Error('No data returned from Finnhub');
  } catch (error) {
    console.error("Finnhub fetch error:", error);
    return [];
  }
};

const fetchRealQuote = async (symbol: string, apiKey: string): Promise<StockQuote | null> => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.c) {
      return data as StockQuote;
    }
    return null;
  } catch (error) {
    console.error("Quote fetch error:", error);
    return null;
  }
};

// Main Export
export const StockService = {
  getCandles: async (symbol: string, range: TimeRange, isRealMode: boolean, apiKey?: string): Promise<CandleData[]> => {
    if (isRealMode && apiKey) {
      const data = await fetchRealCandles(symbol, range, apiKey);
      if (data.length > 0) return data;
      console.warn("Falling back to mock data due to API failure or empty response.");
    }
    
    // Mock Logic
    const seedPrice = symbol === 'AAPL' ? 150 : symbol === 'TSLA' ? 200 : 100;
    const count = range === TimeRange.DAY ? 24 : range === TimeRange.MONTH ? 30 : 100;
    return generateMockCandles(count, seedPrice);
  },

  getQuote: async (symbol: string, isRealMode: boolean, apiKey?: string): Promise<StockQuote> => {
    if (isRealMode && apiKey) {
      const data = await fetchRealQuote(symbol, apiKey);
      if (data) return data;
    }

    // Mock Logic
    const base = 150 + Math.random() * 10;
    return {
      c: parseFloat(base.toFixed(2)),
      d: parseFloat((Math.random() * 5).toFixed(2)),
      dp: parseFloat((Math.random() * 2).toFixed(2)),
      h: parseFloat((base + 2).toFixed(2)),
      l: parseFloat((base - 2).toFixed(2)),
      o: parseFloat((base - 1).toFixed(2)),
      pc: parseFloat((base - 1.5).toFixed(2)),
    };
  }
};