import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/resend/emails': {
          target: 'https://api.resend.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/resend\/emails/, '/emails'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (resendApiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${resendApiKey}`)
              }
            })
          },
        },
      },
    },
  }
})
