<script setup lang="ts">
import { Wifi, WifiOff } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'

const props = defineProps<{ 
  loading: boolean, 
  data?: { 
    ok: boolean; 
    startedAt?: string; 
    uptimeMs?: number 
  } 
}>()

const ok = computed(() => props.data?.ok ?? false)
const started = computed(() => props.data?.startedAt ? new Date(props.data.startedAt) : null)
const uptimeMs = computed(() => props.data?.uptimeMs ?? null)

function fmt(ms: number) {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts: string[] = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  if (s < 60 || parts.length === 0) parts.push(`${sec}s`)
  return parts.length > 0 ? parts.join(' ') : '—'
}
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div 
            class="p-2 rounded-lg"
            :class="ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'"
          >
            <component :is="ok ? Wifi : WifiOff" class="w-5 h-5" />
          </div>
          <h3 class="text-sm font-semibold text-white/90">Status do Servidor</h3>
        </div>
        <div
          class="px-2.5 py-1 text-xs font-medium rounded-full"
          :class="ok 
            ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20' 
            : 'text-red-300 bg-red-500/10 border border-red-500/20'"
        >
          {{ ok ? 'ONLINE' : 'OFFLINE' }}
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-xs font-medium text-white/60 mb-1">Iniciado em</div>
          <div class="text-sm font-medium text-white/90">
            {{ loading ? '...' : (started ? started.toLocaleString() : '—') }}
          </div>
        </div>
        <div>
          <div class="text-xs font-medium text-white/60 mb-1">Tempo de atividade</div>
          <div class="text-sm font-mono font-medium text-white/90">
            {{ loading ? '...' : (uptimeMs ? fmt(uptimeMs) : '—') }}
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
