import { ClientController } from './ClientController';

export class KeepAliveJob {
  static start(intervalMs = 30000, timeoutMs = 120000) {
    setInterval(async () => {
      try {
        await ClientController.markOfflineIfInactive(timeoutMs);
      } catch (err) {
        console.error('[KEEPALIVE JOB] Erro:', err);
      }
    }, intervalMs);

    console.log(`[KEEPALIVE JOB] Rodando a cada ${intervalMs / 1000}s`);
  }
}