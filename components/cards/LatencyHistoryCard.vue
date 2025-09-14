<script setup lang="ts">
import { Gauge } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'
import Sparkline from '~/components/charts/Sparkline.vue'
import { computed } from 'vue'

interface Point {
  t: number
  latency: number | null
  count?: number
}

const props = withDefaults(defineProps<{
  loading?: boolean,
  series?: Point[]
}>(), {
  loading: false,
  series: () => []
})

// Ensure series is always an array of valid points with valid latency values
const safeSeries = computed(() => {
  if (!Array.isArray(props.series)) return []
  return props.series
    .map(p => ({
      t: p?.t || 0,
      latency: p?.latency !== null && p?.latency !== undefined ? Math.max(0, Number(p.latency)) : null
    }))
    .filter((p): p is { t: number; latency: number } => p.latency !== null)
})

// Get latency data for the sparkline
const latencyValues = computed(() => {
  return safeSeries.value.map(p => p.latency)
})

// Calculate stats
const stats = computed(() => {
  if (!latencyValues.value.length) return { min: 0, max: 1, current: 0, avg: 0 }

  const values = latencyValues.value
  const current = values[values.length - 1] || 0
  const min = Math.min(...values)
  const max = Math.max(...values, 1)
  const sum = values.reduce((a, b) => a + b, 0)
  const avg = sum / values.length

  return { min, max, current, avg }
})

// Get latency status
const latencyStatus = computed(() => {
  if (props.loading) return 'loading'
  if (stats.value.current < 150) return 'excellent'
  if (stats.value.current < 400) return 'good'
  return 'poor'
})

const statusConfig = {
  loading: {
    color: 'bg-gray-500',
    text: 'Carregando...',
    label: 'N/A'
  },
  excellent: {
    color: 'bg-emerald-500',
    text: 'Rápida',
    label: 'Ótima'
  },
  good: {
    color: 'bg-yellow-500',
    text: 'Média',
    label: 'Boa'
  },
  poor: {
    color: 'bg-red-500',
    text: 'Lenta',
    label: 'Alta'
  }
}

const currentStatus = computed(() => statusConfig[latencyStatus.value])
</script>

<template>
  <BaseCard class="h-full flex flex-col">
    <!-- Header with plate style -->
    <div class="relative px-6 py-4 border-b border-gray-700/50">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-900/30 opacity-50 rounded-t-lg"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="p-2 rounded-lg"
            :class="`${currentStatus.color}/10 text-${currentStatus.color.split('-')[1]}/80`"
          >
            <Gauge class="w-5 h-5" />
          </div>
          <h3 class="text-sm font-semibold text-white/90">Histórico de Latência</h3>
        </div>
        <div
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="`${currentStatus.color}/10 text-${currentStatus.color.split('-')[1]}/90 border border-${currentStatus.color.split('-')[1]}/20`"
        >
          {{ currentStatus.label }}
        </div>
      </div>
    </div>

    <div class="flex-1 p-6 flex flex-col">
      <!-- Current stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : Math.round(stats.current) }}<span class="text-sm font-normal text-white/60 ml-0.5">ms</span></div>
          <div class="text-xs text-white/60">Atual</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : Math.round(stats.avg) }}<span class="text-sm font-normal text-white/60 ml-0.5">ms</span></div>
          <div class="text-xs text-white/60">Média</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-white">{{ loading ? '--' : Math.round(stats.max) }}<span class="text-sm font-normal text-white/60 ml-0.5">ms</span></div>
          <div class="text-xs text-white/60">Máx</div>
        </div>
      </div>

      <!-- Sparkline chart -->
      <div class="flex-1 min-h-[100px] -mx-2 -mb-2">
        <div v-if="loading" class="h-full flex items-center justify-center">
          <div class="text-white/50">Carregando...</div>
        </div>
        <div v-else-if="!latencyValues.length" class="h-full flex items-center justify-center">
          <div class="text-white/50">Sem dados disponíveis</div>
        </div>
        <Sparkline
          v-else
          :points="latencyValues"
          :color="latencyStatus === 'excellent' ? '#10b981' : latencyStatus === 'good' ? '#eab308' : '#ef4444'"
          :fill-color="latencyStatus === 'excellent' ? 'rgba(16, 185, 129, 0.15)' : latencyStatus === 'good' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)'"
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
