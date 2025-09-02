import type { H3Event } from 'h3'

const BASE = process.env.NUXT_PUBLIC_WS_ADMIN_BASE || ''

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400' // 24 hours
}

// Handler para requisições OPTIONS (pré-voo CORS)
if (import.meta.handlers) {
  import.meta.handlers.options = (event: H3Event) => {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    }
  }
}

async function safeFetch(url: string, init?: RequestInit) {
  const t0 = Date.now()
  const controller = new AbortController()
  // Increased timeout to 55s to accommodate Render's free tier cold starts
  const timeout = setTimeout(() => controller.abort(), 55000) // 55 second timeout

  try {
    const res = await fetch(url, { 
      ...init,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      }
    } as any)
    
    clearTimeout(timeout)
    const latency = Date.now() - t0
    
    if (!res.ok) {
      console.error(`Error in safeFetch: ${res.status} ${res.statusText}`)
      return { ok: false, latency, data: null }
    }
    
    const data = await res.json().catch(() => ({}))
    return { ok: true, latency, data }
  } catch (error: any) {
    clearTimeout(timeout)
    const latency = Date.now() - t0
    console.error(`Error in safeFetch (${url}):`, error.message)
    return { 
      ok: false, 
      latency,
      data: null,
      error: error.name === 'AbortError' ? 'Request timed out' : error.message
    }
  }
}

// Add a helper function to handle CORS preflight
const handleCorsPreflight = (event: H3Event) => {
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.setHeader('Content-Length', '0')
    event.node.res.end()
    return true
  }
  return false
}

export default defineEventHandler(async (event: H3Event) => {
  // Handle CORS preflight
  if (handleCorsPreflight(event)) return
  
  // Set response headers
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...corsHeaders
  })

  if (!BASE) {
    console.error('NUXT_PUBLIC_WS_ADMIN_BASE environment variable is not set')
    return {
      health: { 
        ok: false,
        error: 'Configuration error: NUXT_PUBLIC_WS_ADMIN_BASE not set'
      },
      players: { count: 0 },
      latencyMs: null,
      timestamp: new Date().toISOString()
    }
  }

  const base = BASE.replace(/\/$/, '')

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
