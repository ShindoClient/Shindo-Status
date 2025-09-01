/// <reference types="nuxt" />

// Permite importar arquivos .vue sem erro
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// Tipos extras úteis
/// <reference types="@vueuse/core" />
/// <reference types="@vueuse/motion" />
