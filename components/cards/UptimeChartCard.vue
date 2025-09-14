<script setup lang="ts">
import { Server, Clock } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'
import Sparkline from '~/components/charts/Sparkline.vue'
import { computed, ref, watch } from 'vue'

interface Point {
  t: number
  ok: boolean
}

const props = withDefaults(defineProps<{
  loading?: boolean,
  data?: { ok: boolean }
  series?: Point[]
}>(), {
  loading: false,
  data: () => ({ ok: false }),
  series: () => []
})

// Calculate uptime percentage from historical data
const uptimePercentage = computed(() => {
  if (props.loading) return '--'
  if (!props.series.length) return '--'

  const total = props.series.length
  if (total === 0) return '--'

  const upCount = props.series.filter(p => p.ok).length
  return Math.round((upCount / total) * 100)
})

// Format for sparkline (1 for up, 0 for down)
const uptimePoints = computed(() => {
  return props.series.map(p => p.ok ? 1 : 0)
})

// Current status from the latest data point or direct prop
const currentStatus = computed(() => {
  if (props.loading) return 'loading'

  // First try to get status from the latest point in series
  if (props.series.length > 0) {
    return props.series[props.series.length - 1]?.ok ? 'up' : 'down'
  }

  // Fall back to direct data prop
  return props.data?.ok ? 'up' : 'down'
})

// Format time since last update
const lastUpdated = ref('--')

watch(() => props.series, (newSeries) => {
  if (!newSeries || newSeries.length === 0) {
    lastUpdated.value = '--'
    return
  }

  const lastPoint = newSeries[newSeries.length - 1]
  if (!lastPoint) {
    lastUpdated.value = '--'
    return
  }

  const lastTime = lastPoint.t
  const diffMs = Date.now() - lastTime
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) {
    lastUpdated.value = 'Agora'
  } else if (diffMins < 60) {
    lastUpdated.value = `Há ${diffMins}m`
  } else {
    const hours = Math.floor(diffMins / 60)
    lastUpdated.value = `Há ${hours}h`
  }
}, { immediate: true })
</script>

<template>
  <BaseCard class="h-full flex flex-col">
    <!-- Header with plate style -->
    <div class="relative px-6 py-4 border-b border-gray-700/50">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-50 rounded-t-lg"></div>
      <div class="relative z-10 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-300">
          <Server class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-semibold text-white/90">Histórico de Uptime</h3>
      </div>
    </div>

    <div class="flex-1 p-6 flex flex-col">
      <!-- Current status -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-3xl font-bold text-white">
            {{ uptimePercentage }}<span v-if="uptimePercentage !== '--'" class="text-sm font-normal text-white/60 ml-1">%</span>
          </div>
          <div class="text-xs text-white/60">Taxa de disponibilidade</div>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium text-white flex items-center justify-end gap-2">
            <span>Status:</span>
            <span
              v-if="loading"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-300 border border-gray-500/20"
            >
              Carregando...
            </span>
            <span
              v-else-if="currentStatus === 'up'"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              Online
            </span>
            <span
              v-else
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
              Offline
            </span>
          </div>
          <div class="text-xs text-white/40 mt-1 flex items-center justify-end gap-1">
            <Clock class="w-3 h-3" />
            {{ lastUpdated }}
          </div>
        </div>
      </div>

      <!-- Sparkline chart -->
      <div class="flex-1 min-h-[100px] -mx-2 -mb-2">
        <div v-if="loading" class="h-full flex items-center justify-center">
          <div class="text-white/50">Carregando...</div>
        </div>
        <div v-else-if="!uptimePoints.length" class="h-full flex items-center justify-center">
          <div class="text-white/50">Aguardando dados...</div>
        </div>
        <Sparkline
          v-else
          :points="uptimePoints"
          color="#8b5cf6"
          :fill="false"
          :smooth="true"
          :stroke-width="2"
          class="h-full w-full"
        />
      </div>

      <!-- Timeline labels -->
      <div class="flex justify-between text-xs text-white/40 mt-2 px-1">
        <span>Há 24h</span>
        <span>Agora</span>
      </div>
    </div>
  </BaseCard>
</template>
