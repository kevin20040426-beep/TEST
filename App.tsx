import React, { useState, useEffect, useCallback } from 'react';
import { StockService } from './services/stockService';
import { DataService } from './services/dataService';
import { AIService } from './services/aiService';
import StockChart from './components/StockChart';
import TradingPanel from './components/TradingPanel';
import Dashboard from './components/Dashboard';
import GeminiAnalysis from './components/GeminiAnalysis';
import Education from './components/Education';
import { CandleData, StockQuote, Asset, TradeRecord, MarketAnalysis, TimeRange } from './types';

// Environment Check
// Note: In Vite, we usually use import.meta.env.VITE_xxx. 
// For this generation, we assume standard process.env or import.meta.env handling.
const FINNHUB_KEY = import.meta.env?.VITE_FINNHUB_API_KEY || ''; 
const HAS_REAL_KEYS = !!FINNHUB_KEY;

const App: React.FC = () => {
  // Global State
  const [isRealMode, setIsRealMode] = useState<boolean>(HAS_REAL_KEYS);
  const [currentSymbol, setCurrentSymbol] = useState<string>('AAPL');
  const [symbolInput, setSymbolInput] = useState<string>('AAPL');
  
  // Data State
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  
  // UI State
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.YEAR);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    loadPortfolio();
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealMode]); // Reload if mode changes

  const loadPortfolio = async () => {
    const loadedAssets = await DataService.getAssets(isRealMode);
    const loadedTrades = await DataService.getTrades(isRealMode);
    setAssets(DataService.recalculateAllocation(loadedAssets));
    setTrades(loadedTrades);
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setAnalysis(null); // Reset analysis on new search
    
    try {
      // 1. Get Candles
      const candleData = await StockService.getCandles(currentSymbol, timeRange, isRealMode, FINNHUB_KEY);
      setCandles(candleData);
      
      // 2. Get Quote
      const quoteData = await StockService.getQuote(currentSymbol, isRealMode, FINNHUB_KEY);
      setQuote(quoteData);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentSymbol, timeRange, isRealMode]);

  // Effect to trigger search when symbol/range changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbolInput.trim()) {
      setCurrentSymbol(symbolInput.toUpperCase());
    }
  };

  const handleTrade = async (type: 'BUY' | 'SELL', price: number, qty: number) => {
    setLoading(true);
    const newTrade = await DataService.addTrade({
      symbol: currentSymbol,
      type,
      price,
      quantity: qty
    }, isRealMode);
    
    // Update local state for immediate feedback
    setTrades([newTrade, ...trades]);
    
    // Simple logic to update asset list roughly
    if (type === 'BUY') {
        const newAsset: Asset = {
            id: '',
            name: currentSymbol,
            value: price * qty,
            type: 'STOCK',
            allocation: 0
        };
        const updatedAssets = [...assets, newAsset];
        setAssets(DataService.recalculateAllocation(updatedAssets));
    }
    
    setLoading(false);
    alert('交易成功！已寫入紀錄。');
  };

  const handleAddAsset = async (asset: Asset) => {
    const newAsset = await DataService.addAsset(asset, isRealMode);
    const updated = [...assets, newAsset];
    setAssets(DataService.recalculateAllocation(updated));
  };

  const handleAnalyze = async () => {
    if (!quote) return;
    setAnalyzing(true);
    const result = await AIService.analyzeStock(currentSymbol, quote, isRealMode);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <h1 className="text-xl font-bold text-slate-800">AlphaTrade <span className="text-blue-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border ${isRealMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              <div className={`w-2 h-2 rounded-full ${isRealMode ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              {isRealMode ? '真實模式 (Real API)' : '模擬模式 (Mock Data)'}
            </div>
            {HAS_REAL_KEYS && (
               <button 
                  onClick={() => setIsRealMode(!isRealMode)}
                  className="text-xs text-slate-500 hover:text-blue-600 underline"
               >
                 切換模式
               </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSymbolSubmit} className="flex gap-2 w-full md:w-auto">
             <input 
               type="text" 
               value={symbolInput}
               onChange={(e) => setSymbolInput(e.target.value)}
               className="border border-slate-300 rounded-lg px-4 py-2 w-48 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
               placeholder="輸入代號 (AAPL)"
             />
             <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition">
               載入
             </button>
          </form>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {Object.values(TimeRange).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${timeRange === range ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <StockChart data={candles} symbol={currentSymbol} />
            <GeminiAnalysis 
              symbol={currentSymbol}
              analysis={analysis} 
              onAnalyze={handleAnalyze} 
              isLoading={analyzing} 
            />
          </div>

          {/* Right Column: Trading & Edu */}
          <div className="space-y-6">
            <TradingPanel 
              symbol={currentSymbol} 
              quote={quote} 
              onGetQuote={handleSearch} 
              onTrade={handleTrade}
              isLoading={loading}
            />
            <Education />
          </div>
        </div>

        {/* Bottom Section: Dashboard */}
        <Dashboard assets={assets} trades={trades} onAddAsset={handleAddAsset} />
        
      </main>
    </div>
  );
};

export default App;