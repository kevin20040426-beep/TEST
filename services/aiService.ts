import { GoogleGenAI } from "@google/genai";
import { StockQuote, MarketAnalysis } from "../types";

export const AIService = {
  analyzeStock: async (symbol: string, quote: StockQuote, isRealMode: boolean): Promise<MarketAnalysis> => {
    if (isRealMode && process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          你是專業的金融投資顧問。請根據以下股票數據提供簡短的投資分析與建議。
          股票代號: ${symbol}
          現價: ${quote.c}
          今日漲跌: ${quote.d} (${quote.dp}%)
          
          請回答兩部分：
          1. 市場總結 (Summary)
          2. 投資建議 (Actionable Advice)
          
          要求：請使用純文字 (Plain Text)，不要使用 Markdown，不要粗體，不要標題符號。請用繁體中文回答。字數控制在 150 字以內。
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        // 安全處理 response.text (可能為 undefined)
        const summaryText = response.text ? response.text.trim() : "無法取得分析內容";

        return {
          symbol,
          summary: summaryText,
          recommendation: "基於 AI 分析",
          loading: false
        };
      } catch (error) {
        console.error("Gemini API Error:", error);
        return {
          symbol,
          summary: "AI 服務暫時無法使用，請檢查 API Key 或網路連線。",
          recommendation: "暫無建議",
          loading: false
        };
      }
    }

    // Mock Response
    return new Promise(resolve => {
      setTimeout(() => {
        const trend = quote.d >= 0 ? "上漲趨勢" : "下跌修正";
        resolve({
          symbol,
          summary: `[模擬模式] ${symbol} 目前呈現${trend}，今日價格波動為 ${quote.dp}%。技術指標顯示短期均線支撐強勁，成交量穩定。`,
          recommendation: quote.d >= 0 ? "建議續抱，觀察上方壓力位。" : "建議觀望，等待底部訊號確認。",
          loading: false
        });
      }, 1500);
    });
  }
};