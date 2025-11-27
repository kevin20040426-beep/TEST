import React from 'react';
import { ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { CandleData } from '../types';

interface StockChartProps {
  data: CandleData[];
  symbol: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-bold text-slate-700">{data.dateStr}</p>
        <p className="text-slate-600">開: {data.open}</p>
        <p className="text-slate-600">高: {data.high}</p>
        <p className="text-slate-600">低: {data.low}</p>
        <p className="text-slate-600">收: {data.close}</p>
        <p className="text-slate-500 text-xs mt-1">量: {data.volume.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-400">尚無數據</div>;

  // Transform for Recharts:
  // We use a Bar chart where the bar represents the body (Open-Close).
  // We overlay lines for High-Low.
  
  const chartData = data.map(d => ({
    ...d,
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    color: d.close >= d.open ? '#10b981' : '#ef4444'
  }));
  
  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{symbol} 行情走勢</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" tick={{fontSize: 10}} minTickGap={30} />
            <YAxis domain={[minPrice, maxPrice]} orientation="right" tick={{fontSize: 10}} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Candle Body (Simulated with Bar range) */}
            <Bar dataKey="body" barSize={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
             
            {/* High/Low Wicks - Simplified */}
             <ReferenceLine y={0} stroke="#000" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[100px] mt-2">
         <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
               <XAxis dataKey="dateStr" hide />
               <YAxis orientation="right" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
               <Bar dataKey="volume" fill="#cbd5e1" barSize={8} />
            </ComposedChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;