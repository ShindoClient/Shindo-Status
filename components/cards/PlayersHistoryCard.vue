<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'
import Sparkline from '~/components/charts/Sparkline.vue'
import { computed, withDefaults, defineProps } from 'vue'

interface Point {
  t: number
  count: number
  latency?: number | null
}

const props = withDefaults(defineProps<{
  loading?: boolean,
  series?: Point[]
}>(), {
  loading: false,
  series: () => []
})

// Ensure series is always an array of valid points
const safeSeries = computed(() => {
  if (!Array.isArray(props.series)) return []
  return props.series
    .map(p => ({
      t: p?.t || 0,
      count: typeof p?.count === 'number' ? Math.max(0, p.count) : 0
    }))
    .filter(Boolean)
})

// Get player count data for the sparkline
const playerCounts = computed(() => {
  return safeSeries.value.map(p => p.count)
})

// Calculate min/max for the current view
const stats = computed(() => {
  if (!playerCounts.value.length) return { min: 0, max: 1, current: 0, total: 0 }

  const counts = playerCounts.value
  const current = counts[counts.length - 1] || 0
  const min = Math.min(...counts)
  const max = Math.max(...counts, 1) // Ensure max is at least 1 to avoid division by zero
  const total = counts.reduce((sum, count) => sum + count, 0)

  return { min, max, current, total, avg: total / counts.length || 0 }
})
</script>

<template>
  <BaseCard class="h-full flex flex-col">
    <!-- Header with plate style -->
    <div class="relative px-6 py-4 border-b border-gray-700/50">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-900/30 opacity-50 rounded-t-lg"></div>
      <div class="relative z-10 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-blue-500/10 text-blue-300">
          <Users class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-semibold text-white/90">Histórico de Jogadores</h3>
      </div>
    </div>

    <div class="flex-1 p-6 flex flex-col">
      <!-- Current stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : stats.current }}</div>
          <div class="text-xs text-white/60">Atual</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : Math.round(stats.avg) }}</div>
          <div class="text-xs text-white/60">Média</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : stats.max }}</div>
          <div class="text-xs text-white/60">Máx</div>
        </div>
      </div>

      <!-- Sparkline chart -->
      <div class="flex-1 min-h-[100px] -mx-2 -mb-2">
        <div v-if="loading" class="h-full flex items-center justify-center">
          <div class="text-white/50">Carregando...</div>
        </div>
        <div v-else-if="!playerCounts.length" class="h-full flex items-center justify-center">
          <div class="text-white/50">Sem dados disponíveis</div>
        </div>
        <Sparkline
          v-else
          :points="playerCounts"
          color="#3b82f6"
          fill-color="rgba(59, 130, 246, 0.15)"
          :smooth="true"
          class="h-full w-full"
        />
      </div>

      <!-- Timeline labels -->
      <div class="flex justify-between text-xs text-white/40 mt-2 px-1">
        <span>Há 10 min</span>
        <span>Agora</span>
      </div>
    </div>
  </BaseCard>
</template>
