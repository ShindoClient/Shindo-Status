import type { H3Event } from 'h3'

const BASE = process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''

async function safeFetch(url: string, init?: RequestInit) {
  const t0 = Date.now()
  try {
    const res = await fetch(url, { cache: 'no-store', ...init } as any)
    const latency = Date.now() - t0
    if (!res.ok) return { ok: false, latency, data: null }
    const data = await res.json().catch(() => ({}))
    return { ok: true, latency, data }
  } catch {
    return { ok: false, latency: Date.now() - t0, data: null }
  }
}

// Configura headers para evitar cache
const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
}

export default defineEventHandler(async (event: H3Event) => {
  // Configura os headers de resposta
  setResponseHeaders(event, defaultHeaders)
    
  if (!BASE) {
    return {
      health: { ok: false },
      players: { count: 0 },
      latencyMs: null,
      note: 'Defina NUXT_PUBLIC_WS_ADMIN_BASE no ambiente.'
    }
  }

  const base = 'https://ws.shindoclient.com'

  const healthUrl = `${base}/v1/health`
  let health = { ok: false, startedAt: undefined as string | undefined, uptimeMs: undefined as number | undefined }
  let latencyMs: number | null = null

  try {
      // Se o HEAD funcionar, fazemos uma requisição GET para pegar os dados
      const startTime = Date.now()
      const response = await fetch(healthUrl, { 
        cache: 'no-store' 
      } as any)
      
      latencyMs = Date.now() - startTime
      
      if (response.ok) {
        try {
          const data = await response.json()
          // Extrai os valores corretamente baseado na resposta fornecida
          health = {
            ok: data?.ok === true || data === true,
            startedAt: data?.startedAt || undefined,
            uptimeMs: typeof data?.uptimeMs === 'number' ? data.uptimeMs : undefined
          }
        } catch (e) {
          console.error('Erro ao processar resposta do health:', e)
          health = { ok: false, startedAt: undefined, uptimeMs: undefined }
        }
      }
  } catch (error) {
    console.error('Erro ao acessar o endpoint de health:', error)
    const cu = await safeFetch(`${base}/v1/connected-users`)
    latencyMs = cu.latency
    health = { ok: false, startedAt: undefined, uptimeMs: undefined }
  }

  const users = await safeFetch(`${base}/v1/connected-users`)
  const count = users.ok && (users.data as any)?.users ? Number((users.data as any).users.length) : 0

  return {
    health,
    players: { count },
    latencyMs,
    timestamp: new Date().toISOString() // Adiciona um timestamp para garantir respostas únicas
  }
})
