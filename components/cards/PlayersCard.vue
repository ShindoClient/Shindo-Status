<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'

const props = withDefaults(defineProps<{
  loading?: boolean,
  count?: number
}>(), {
  loading: false,
  count: 0
})

// Garante que o valor seja um número válido
const last = computed(() => {
  if (props.loading) return 0
  const count = Number(props.count)
  return isFinite(count) ? Math.max(0, count) : 0
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

      <div class="mt-4 text-xs text-white/50">
        Atualizado em tempo real
      </div>
    </div>
  </BaseCard>
</template>
