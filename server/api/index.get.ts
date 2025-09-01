// Configura headers para evitar cache
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
}

export default defineEventHandler((event) => {
  // Configura os headers de resposta
  Object.entries(noCacheHeaders).forEach(([key, value]) => {
    setResponseHeader(event, key, value)
  })
  
  // Retorna um objeto vazio ou redireciona para a rota de status
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Shindo API - Use /api/status para verificar o status do servidor'
  }
})
