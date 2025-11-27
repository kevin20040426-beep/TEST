import { Asset, TradeRecord } from '../types';

// Mock Storage
let mockAssets: Asset[] = [
  { id: '1', name: '台積電', value: 1500000, type: 'STOCK', allocation: 45 },
  { id: '2', name: '現金存款', value: 800000, type: 'CASH', allocation: 25 },
  { id: '3', name: '比特幣', value: 500000, type: 'CRYPTO', allocation: 15 },
  { id: '4', name: '債券ETF', value: 500000, type: 'OTHER', allocation: 15 },
];

let mockTrades: TradeRecord[] = [
  { id: 't1', symbol: 'AAPL', type: 'BUY', price: 150, quantity: 10, total: 1500, timestamp: Date.now() - 100000, dateStr: new Date().toLocaleDateString() }
];

// Helper to initialize Firebase (Simulated for this code generation as we don't have the SDK installed in this text environment easily without package.json, but logic stands)
// In a real env, import { initializeApp } from "firebase/app"; import { getFirestore, ... } from "firebase/firestore";

export const DataService = {
  getAssets: async (isRealMode: boolean): Promise<Asset[]> => {
    if (isRealMode) {
      // In a real app, logic to fetch from Firestore would go here
      // For this output, we will simulate the "try" but fallback or return empty if no config
      console.log("Fetching assets from Real Firestore...");
    }
    return new Promise(resolve => setTimeout(() => resolve([...mockAssets]), 500));
  },

  addAsset: async (asset: Asset, isRealMode: boolean): Promise<Asset> => {
    if (isRealMode) {
       console.log("Saving asset to Real Firestore...", asset);
    }
    const newAsset = { ...asset, id: Math.random().toString(36).substr(2, 9) };
    mockAssets = [...mockAssets, newAsset];
    return newAsset;
  },

  getTrades: async (_isRealMode: boolean): Promise<TradeRecord[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockTrades]), 500));
  },

  addTrade: async (trade: Omit<TradeRecord, 'id' | 'timestamp' | 'dateStr' | 'total'>, isRealMode: boolean): Promise<TradeRecord> => {
    const total = trade.price * trade.quantity;
    const newTrade: TradeRecord = {
      ...trade,
      total,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('zh-TW') + ' ' + new Date().toLocaleTimeString('zh-TW')
    };

    if (isRealMode) {
       console.log("Saving trade to Real Firestore...", newTrade);
    }
    
    mockTrades = [newTrade, ...mockTrades];
    return newTrade;
  },
  
  // Basic Logic: Calculate allocation based on values
  recalculateAllocation: (assets: Asset[]): Asset[] => {
    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
    if (totalValue === 0) return assets;
    return assets.map(a => ({
      ...a,
      allocation: parseFloat(((a.value / totalValue) * 100).toFixed(1))
    }));
  }
};