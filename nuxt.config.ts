// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

const noCacheHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
}

export default defineNuxtConfig({
    future: { compatibilityVersion: 4 },
    devtools: { enabled: true },
    typescript: { strict: true },

    css: ['~/assets/css/tailwind.css'],

    // PostCSS inline (sem postcss.config.cjs)
    postcss: {
        plugins: { tailwindcss: {}, autoprefixer: {} },
    },

    modules: ['@vueuse/motion/nuxt'],

    // ✅ Use apenas este block para CORS/headers nas rotas
    routeRules: {
        '/api/**': {
            cors: true,
            headers: noCacheHeaders,
        },
    },

    runtimeConfig: {
        public: {
            // defina NUXT_PUBLIC_WS_ADMIN_BASE no painel da Vercel
            wsAdminBase: process.env.NUXT_PUBLIC_WS_ADMIN_BASE || '',
        },
    },

    // Edge runtime no Vercel
    nitro: {
        preset: 'vercel-edge',
    },

    app: {
        head: {
            meta: [
                { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
                { 'http-equiv': 'Pragma', content: 'no-cache' },
                { 'http-equiv': 'Expires', content: '0' },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.ico' }],
        },
    },
})
