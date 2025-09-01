// https://nuxt.com/docs/guide/directory-structure/plugins#automatic-imports
/// <reference types="@nuxt/kit" />
/// <reference types="@nuxt/schema" />

// Vue 3 type declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: any) => string
  }
}

// Nuxt 3 auto-imports
declare module '#app' {
  interface RuntimeNuxtHooks {
    'app:created': () => void
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: any) => string
  }
}

export {}

// Tipos extras úteis
/// <reference types="@vueuse/core" />
/// <reference types="@vueuse/motion" />
