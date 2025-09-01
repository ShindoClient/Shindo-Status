<script setup lang="ts">
import BaseCard from '~/components/cards/BaseCard.vue'
import UptimeCard from '~/components/cards/UptimeCard.vue'
import PlayersCard from '~/components/cards/PlayersCard.vue'
import LatencyCard from '~/components/cards/LatencyCard.vue'
import { useStatus } from '~/composables/useStatus'
import { useStatusHistory } from '~/composables/useStatusHistory'

const { data, pending, refresh, error } = await useStatus({ lazy: false, server: true })
const { players, latency } = useStatusHistory(data, pending)
</script>

<template>
  <main class="min-h-screen px-6 py-10">
    <header class="group relative rounded-2xl border-2 border-gray-500/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 mb-8 transition-all duration-300 hover:border-brand-500/80 hover:shadow-lg hover:shadow-brand-500/10">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/5 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col">
          <div class="flex items-start gap-3">
            <img 
              src="~/assets/logo.png" 
              alt="Shindo Logo" 
              class="w-10 h-10 md:w-12 md:h-12 rounded-lg mt-0.5"
            />
            <div class="flex flex-col">
              <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">Shindo API Status</h1>
              <p class="text-sm text-white/70 -mt-1">Monitoramento em tempo real do status da API e servidores</p>
            </div>
          </div>
        </div>
        <button
          @click="refresh()"
          :disabled="pending"
          class="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white/90 hover:bg-brand-500/20 hover:border-brand-500/50 hover:text-white transition-all duration-300 group/button overflow-hidden"
        >
          <span class="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
          <span class="relative z-10 flex items-center gap-2 text-sm font-medium">
            <svg 
              v-if="!pending"
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="w-4 h-4 transition-transform duration-500 group-hover/button:rotate-180"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 16h5v5"></path>
            </svg>
            <svg 
              v-else
              class="animate-spin h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="whitespace-nowrap">{{ pending ? 'Atualizando...' : 'Atualizar' }}</span>
          </span>
        </button>
      </div>
    </header>

    <section class="grid gap-6 md:grid-cols-3 mt-8">
      <UptimeCard :loading="pending" :data="data?.health" />
      <PlayersCard :loading="pending" :count="data?.players.count ?? 0" :series="players.map(p => ({ t: p.t, count: p.count }))" />
      <LatencyCard :loading="pending" :latency-ms="(data?.latencyMs ?? null) as any" />
    </section>

    <div v-if="error" class="mt-6 text-sm text-red-300">
      Falha ao carregar. Verifique a env <code class="text-red-200">NUXT_PUBLIC_WS_ADMIN_BASE</code>.
    </div>
  </main>
</template>
