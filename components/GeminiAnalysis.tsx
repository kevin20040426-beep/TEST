import React from 'react';
import { MarketAnalysis } from '../types';

interface GeminiAnalysisProps {
  analysis: MarketAnalysis | null;
  onAnalyze: () => void;
  isLoading: boolean;
  symbol: string;
}

const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ analysis, onAnalyze, isLoading, symbol }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI 智能行情分析 ({symbol})
        </h3>
        <button 
          onClick={onAnalyze}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
        >
          {isLoading ? '分析中...' : '生成分析報告'}
        </button>
      </div>

      {analysis ? (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
            <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">市場總結</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{analysis.summary}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-emerald-50 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-2">投資建議</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{analysis.recommendation}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-indigo-300">
           <p className="text-sm">點擊按鈕，讓 Gemini 為您解析最新市場動態。</p>
        </div>
      )}
    </div>
  );
};

export default GeminiAnalysis;