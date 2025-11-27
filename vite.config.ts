import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // 重要：請將 '/alphatrade-pro/' 替換為您在 GitHub 上建立的 Repository 名稱
    // 例如您的 Repo 是 'my-stock'，這裡就填 '/my-stock/'
    base: '/alphatrade-pro/', 
    define: {
      // 橋接環境變數：將 VITE_GOOGLE_API_KEY 注入為 process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY),
      // 防止其他套件存取 process.env 時報錯
      'process.env': {}
    }
  }
})