import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  // Esta rota nunca deve ser acessada diretamente
  return {
    status: 'error',
    message: 'Rota de API não encontrada'
  }
})
