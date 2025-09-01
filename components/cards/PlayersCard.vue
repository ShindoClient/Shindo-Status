<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import Sparkline from '~/components/charts/Sparkline.vue'
import BaseCard from './BaseCard.vue'

interface Point {
  t: number
  count: number
  latency?: number | null
}

const props = withDefaults(defineProps<{ 
  loading?: boolean, 
  count?: number, 
  series?: Point[] 
}>(), {
  loading: false,
  count: 0,
  series: () => []
})

// Garante que o valor seja um número válido
const last = computed(() => {
  if (props.loading) return 0
  const count = Number(props.count)
  return isFinite(count) ? Math.max(0, count) : 0
})

// Garante que series é sempre um array de pontos válidos
const safeSeries = computed(() => {
  if (!Array.isArray(props.series)) return []
  return props.series
    .map(p => ({
      t: p?.t || 0,
      count: typeof p?.count === 'number' ? Math.max(0, p.count) : 0
    }))
    .filter(Boolean)
})
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 rounded-lg bg-brand-500/10 text-brand-300">
          <Users class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-semibold text-white/90">Jogadores Online</h3>
      </div>
    </template>

    <div class="flex flex-col h-full">
      <div class="flex items-end gap-2">
        <div class="text-4xl font-bold tracking-tight text-white">
          {{ loading || last === undefined ? '—' : last }}
        </div>
        <div class="mb-1 text-sm text-white/60">
          {{ last === 1 ? 'jogador' : 'jogadores' }}
        </div>
      </div>

      <div class="mt-6">
        <div class="h-16 -mx-2">
          <Sparkline
            :points="safeSeries.map(p => p?.count || 0)"
            :height="64"
            :stroke-width="2"
            class="opacity-90"
          />
        </div>
        <div class="mt-2 text-xs text-white/50 text-center">
          Últimos minutos (atualiza a cada 10s)
        </div>
      </div>
    </div>
  </BaseCard>
</template>
