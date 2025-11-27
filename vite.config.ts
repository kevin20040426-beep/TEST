import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // 使用相對路徑 './'，確保無論 Repo 名稱是什麼(如 alphatrade-pro 或 TEST)都能正常顯示
    base: './', 
    define: {
      // 確保 API KEY 即使為空也不會導致錯誤
      'process.env.API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY || ''),
      // 防止瀏覽器報錯 process is not defined
      'process.env': {}
    }
  }
})