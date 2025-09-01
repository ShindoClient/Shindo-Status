<script setup lang="ts">
import { Gauge } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ 
  loading: boolean, 
  latencyMs: number | null 
}>()

const latencyStatus = computed(() => {
  if (props.loading || props.latencyMs == null) return 'loading'
  if (props.latencyMs < 150) return 'excellent'
  if (props.latencyMs < 400) return 'good'
  return 'poor'
})

const statusConfig = {
  loading: {
    color: 'bg-gray-500',
    text: 'Carregando...',
    icon: Gauge,
    label: 'N/A'
  },
  excellent: {
    color: 'bg-emerald-500',
    text: 'Rápida',
    icon: Gauge,
    label: 'Ótima'
  },
  good: {
    color: 'bg-yellow-500',
    text: 'Média',
    icon: Gauge,
    label: 'Boa'
  },
  poor: {
    color: 'bg-red-500',
    text: 'Lenta',
    icon: Gauge,
    label: 'Alta'
  }
}

const currentStatus = computed(() => statusConfig[latencyStatus.value])

const barPct = computed(() => {
  if (props.latencyMs == null) return 0
  const v = props.latencyMs ?? 0
  const capped = Math.min(800, Math.max(0, v))
  return (capped / 800) * 100
})
</script>

<template>
  <BaseCard 
    class="group relative overflow-hidden border-2 transition-all duration-300"
    :class="{
      'border-emerald-500/50 hover:border-emerald-400/60': latencyStatus === 'excellent',
      'border-yellow-500/50 hover:border-yellow-400/60': latencyStatus === 'good',
      'border-red-500/50 hover:border-red-400/60': latencyStatus === 'poor',
      'border-gray-500/50 hover:border-gray-400/60': latencyStatus === 'loading'
    }"
  >
    <!-- Efeito de brilho no hover -->
    <div 
      class="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/5 to-brand-500/0 
             opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :class="{
        'via-emerald-500/5': latencyStatus === 'excellent',
        'via-yellow-500/5': latencyStatus === 'good',
        'via-red-500/5': latencyStatus === 'poor',
        'via-gray-500/5': latencyStatus === 'loading'
      }"
    ></div>
    
    <template #header>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div 
            class="p-2 rounded-lg"
            :class="`${currentStatus.color}/10 text-${currentStatus.color.split('-')[1]}/80`"
          >
            <component :is="currentStatus.icon" class="w-5 h-5" />
          </div>
          <h3 class="text-sm font-semibold text-white/90">Latência</h3>
        </div>
        <div 
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="`${currentStatus.color}/10 text-${currentStatus.color.split('-')[1]}/90 border border-${currentStatus.color.split('-')[1]}/20`"
        >
          {{ currentStatus.label }}
        </div>
      </div>
    </template>

    <div class="space-y-4 relative z-10">
      <div class="text-3xl font-bold text-white">
        <template v-if="loading || latencyMs === null">
          <span class="text-gray-400">--</span>
        </template>
        <template v-else>
          {{ latencyMs }}<span class="text-lg text-gray-400">ms</span>
        </template>
      </div>

      <!-- Barra de Latência -->
      <div class="mt-4">
        <div class="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500 ease-out"
            :class="{
              'bg-emerald-500': latencyStatus === 'excellent',
              'bg-yellow-500': latencyStatus === 'good',
              'bg-red-500': latencyStatus === 'poor',
              'bg-gray-500': latencyStatus === 'loading'
            }"
            :style="{ width: `${barPct}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>0ms</span>
          <span>800ms+</span>
        </div>
      </div>
      </div>
      
      <p class="text-sm text-gray-400">
        {{ currentStatus.text }}
      </p>
  </BaseCard>
</template>
