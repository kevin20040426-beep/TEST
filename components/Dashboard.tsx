import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { Asset, TradeRecord } from '../types';

interface DashboardProps {
  assets: Asset[];
  trades: TradeRecord[];
  onAddAsset: (asset: Asset) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ assets, trades, onAddAsset }) => {
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetValue, setNewAssetValue] = useState(0);
  const [newAssetType, setNewAssetType] = useState<Asset['type']>('STOCK');

  const totalWealth = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssetName && newAssetValue > 0) {
      onAddAsset({
        id: '',
        name: newAssetName,
        value: newAssetValue,
        type: newAssetType,
        allocation: 0
      });
      setNewAssetName('');
      setNewAssetValue(0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">資產配置看板</h3>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assets as any}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assets.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-slate-400">總市值</p>
                <p className="text-lg font-bold text-slate-800">${(totalWealth / 10000).toFixed(1)}萬</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-4">
            <h4 className="font-bold text-slate-700 mb-2">記帳功能 - 新增資產</h4>
            <form onSubmit={handleAddAsset} className="space-y-2">
              <input 
                type="text" 
                placeholder="資產名稱 (如: 台積電)" 
                className="w-full border p-2 rounded text-sm"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="市值" 
                className="w-full border p-2 rounded text-sm"
                value={newAssetValue || ''}
                onChange={(e) => setNewAssetValue(parseFloat(e.target.value))}
              />
              <select 
                className="w-full border p-2 rounded text-sm bg-white"
                value={newAssetType}
                onChange={(e) => setNewAssetType(e.target.value as any)}
              >
                <option value="STOCK">股票</option>
                <option value="CASH">現金</option>
                <option value="CRYPTO">加密貨幣</option>
                <option value="REAL_ESTATE">房地產</option>
                <option value="OTHER">其他</option>
              </select>
              <button className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700 transition">
                新增資產
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4">交易歷史紀錄</h3>
        <div className="overflow-y-auto max-h-[300px]">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0">
              <tr>
                <th className="px-4 py-2">日期</th>
                <th className="px-4 py-2">標的</th>
                <th className="px-4 py-2">買/賣</th>
                <th className="px-4 py-2">價格</th>
                <th className="px-4 py-2">股數</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">尚無交易紀錄</td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 whitespace-nowrap">{trade.dateStr.split(' ')[0]}</td>
                    <td className="px-4 py-2 font-bold">{trade.symbol}</td>
                    <td className={`px-4 py-2 font-bold ${trade.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {trade.type === 'BUY' ? '買進' : '賣出'}
                    </td>
                    <td className="px-4 py-2">${trade.price}</td>
                    <td className="px-4 py-2">{trade.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;