import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    future: { compatibilityVersion: 4 },
    devtools: { enabled: true },
    typescript: { strict: true },
    css: ['~/assets/css/tailwind.css'],
    modules: ['@vueuse/motion/nuxt'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            wsAdminBase: process.env.NUXT_PUBLIC_WS_ADMIN_BASE || '',
        }
    },
    nitro: {
        preset: 'node-server'
    }
})
