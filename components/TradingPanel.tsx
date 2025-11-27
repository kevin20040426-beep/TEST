import React, { useState } from 'react';
import { StockQuote } from '../types';

interface TradingPanelProps {
  symbol: string;
  quote: StockQuote | null;
  onGetQuote: () => void;
  onTrade: (type: 'BUY' | 'SELL', price: number, qty: number) => void;
  isLoading: boolean;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ symbol, quote, onGetQuote, onTrade, isLoading }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    onTrade(orderType, quote.c, quantity);
  };

  const totalCost = quote ? (quote.c * quantity).toFixed(2) : '0.00';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-1 rounded-md text-sm">模擬</span>
        交易下單
      </h3>

      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500 font-medium">當前標的</span>
          <span className="text-xl font-black text-slate-800">{symbol}</span>
        </div>
        
        {quote ? (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-slate-900">${quote.c}</p>
              <p className={`text-sm font-medium ${quote.d >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {quote.d > 0 ? '+' : ''}{quote.d} ({quote.dp}%)
              </p>
            </div>
            <button 
              onClick={onGetQuote}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              更新報價
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
             <button 
                onClick={onGetQuote}
                disabled={isLoading}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition"
              >
                {isLoading ? '詢價中...' : '點擊詢價'}
              </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setOrderType('BUY')}
            className={`flex-1 py-2 rounded-lg font-bold transition ${orderType === 'BUY' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
          >
            買進 (Buy)
          </button>
          <button
            type="button"
            onClick={() => setOrderType('SELL')}
            className={`flex-1 py-2 rounded-lg font-bold transition ${orderType === 'SELL' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
          >
            賣出 (Sell)
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">股數 (Quantity)</label>
          <input 
            type="number" 
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center py-2 border-t border-slate-100 mt-4">
          <span className="text-slate-500">預估總額</span>
          <span className="text-xl font-bold text-slate-800">${totalCost}</span>
        </div>

        <button 
          type="submit"
          disabled={!quote || isLoading || quantity <= 0}
          className={`w-full py-3 rounded-lg text-white font-bold shadow-lg transition transform active:scale-95 
            ${!quote ? 'bg-slate-300 cursor-not-allowed' : orderType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
        >
          確認交易
        </button>
      </form>
    </div>
  );
};

export default TradingPanel;