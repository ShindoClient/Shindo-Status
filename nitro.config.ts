import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  },
  runtimeConfig: {
    public: {
      wsAdminBase: process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''
    }
  }
})
