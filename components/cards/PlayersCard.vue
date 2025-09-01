<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import Sparkline from '~/components/charts/Sparkline.vue'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ 
  loading: boolean, 
  count: number, 
  series?: { t: number, count: number }[] 
}>()

const last = computed(() => props.count ?? 0)
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
          {{ loading ? '—' : last }}
        </div>
        <div class="mb-1 text-sm text-white/60">
          {{ last === 1 ? 'jogador' : 'jogadores' }}
        </div>
      </div>

      <div class="mt-6">
        <div class="h-16 -mx-2">
          <Sparkline
            :points="(series || []).map(p => p.count)"
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
