export interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dateStr: string;
}

export interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
}

export interface TradeRecord {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  dateStr: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'CASH' | 'STOCK' | 'CRYPTO' | 'REAL_ESTATE' | 'OTHER';
  allocation: number; // percentage
}

export interface MarketAnalysis {
  symbol: string;
  summary: string;
  recommendation: string;
  loading: boolean;
}

export enum TimeRange {
  DAY = '1D',
  MONTH = '1M',
  YEAR = '1Y'
}

// Ensure global env vars are typed (although in vite usually import.meta.env, we use process.env for compatibility with some bundlers and the prompt instructions)
declare global {
  interface Window {
    // For specific browser capabilities if needed
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    }
  }

  interface ImportMetaEnv {
    readonly VITE_FINNHUB_API_KEY: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}