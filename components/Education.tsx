import React, { useState } from 'react';

const Education: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tips = [
    {
      title: "如何看懂 K 線圖 (Candlestick)",
      content: "K 線由「實體」和「影線」組成。紅色(或空心)通常代表上漲(收盤 > 開盤)，綠色(或實心)代表下跌(收盤 < 開盤)。實體上下緣代表開盤與收盤價，影線頂底端代表最高與最低價。"
    },
    {
      title: "成交量 (Volume) 的意義",
      content: "成交量代表市場的活躍程度。價格上漲且成交量放大，通常代表趨勢強勁；價格上漲但量縮，可能代表追價意願不足，需小心反轉。"
    },
    {
      title: "簡單的移動平均線 (SMA)",
      content: "均線代表過去一段時間的平均成本。當股價站上均線，視為強勢；跌破均線，視為弱勢。常見的有 5日(週線)、20日(月線)、60日(季線)。"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">新手投資教室</h3>
      <div className="flex space-x-2 mb-4 border-b border-slate-100">
        {tips.map((tip, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`pb-2 px-4 text-sm font-medium transition ${activeTab === idx ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tip.title.split(' ')[0]}...
          </button>
        ))}
      </div>
      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-bold text-slate-800 mb-2">{tips[activeTab].title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{tips[activeTab].content}</p>
      </div>
    </div>
  );
};

export default Education;