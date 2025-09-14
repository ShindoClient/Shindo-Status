<script setup lang="ts">
import BaseCard from '~/components/cards/BaseCard.vue'
import UptimeCard from '~/components/cards/UptimeCard.vue'
import PlayersCard from '~/components/cards/PlayersCard.vue'
import LatencyCard from '~/components/cards/LatencyCard.vue'
import PlayersHistoryCard from '~/components/cards/PlayersHistoryCard.vue'
import LatencyHistoryCard from '~/components/cards/LatencyHistoryCard.vue'
import ComingSoonCard from '~/components/cards/ComingSoonCard.vue'
import UptimeChartCard from '~/components/cards/UptimeChartCard.vue'
import OnlinePlayersCard from '~/components/cards/OnlinePlayersCard.vue'
import { useStatus } from '~/composables/useStatus'
import { useStatusHistory } from '~/composables/useStatusHistory'
import { useOnlinePlayers } from '~/composables/useOnlinePlayers'

// Garante que os dados iniciais tenham a estrutura correta
const defaultData = {
  health: { ok: false },
  players: { count: 0 },
  latencyMs: null
}

const { data = ref(defaultData), pending, refresh, error } = await useStatus({ lazy: false, server: true })
const { players, latency, uptimeSeries } = useStatusHistory(data, pending)

// Função segura para obter o contador de jogadores
const playerCount = computed(() => {
  return data.value?.players?.count ?? 0
})

// Get the base URL from environment variables
const config = useRuntimeConfig()
const { players: onlinePlayers, playersByRank, fetchPlayers, loading: playersLoading } = useOnlinePlayers(config.public.wsAdminBase)

// Fetch players when component mounts
onMounted(async () => {
  await fetchPlayers()

  // Set up polling to refresh players every 30 seconds
  const interval = setInterval(fetchPlayers, 30000)

  // Clean up interval on component unmount
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <main class="min-h-screen px-4 sm:px-6 py-8 bg-gray-900">
    <!-- Header -->
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

    <!-- Status Section -->
    <section class="mb-12">
      <div class="relative flex justify-center mb-8">
        <span class="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full shadow-lg inline-flex items-center">
          <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          Status do Servidor
        </span>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <UptimeCard
          :loading="pending"
          :data="data?.health"
        />
        <PlayersCard
          :loading="pending"
          :count="playerCount"
        />
        <LatencyCard
          :loading="pending"
          :latency-ms="(data?.latencyMs ?? null) as any"
        />
      </div>
    </section>

    <!-- Analytics Section -->
    <section class="mb-12">
      <div class="relative flex justify-center mb-8">
        <span class="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full shadow-lg inline-flex items-center">
          <svg class="w-3 h-3 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Análise de Desempenho
        </span>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <UptimeChartCard
          :loading="pending"
          :data="data?.health"
          :series="uptimeSeries"
        />
        <PlayersHistoryCard
          :loading="pending"
          :series="players"
        />
        <LatencyHistoryCard
          :loading="pending"
          :series="latency"
        />
      </div>
    </section>

    <!-- Players Section -->
    <section class="mb-12">
      <div class="relative flex justify-center mb-8">
        <span class="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-full shadow-lg inline-flex items-center">
          <svg class="w-3 h-3 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Jogadores
        </span>
      </div>

      <div class="grid gap-6">
        <OnlinePlayersCard
            :loading="playersLoading"
            :players="onlinePlayers"
            :players-by-rank="playersByRank"
        />
      </div>
    </section>

    <div v-if="error" class="mt-6 text-sm text-red-300 text-center">
      Falha ao carregar. Verifique a env <code class="text-red-200">NUXT_PUBLIC_WS_ADMIN_BASE</code>.
    </div>
  </main>
</template>
