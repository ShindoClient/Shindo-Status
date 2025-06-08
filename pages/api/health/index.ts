import { NextApiRequest, NextApiResponse } from 'next';
import { HealthController } from '../../../controllers/HealthController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    const result = await HealthController.check();
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API] Erro ao verificar saúde da API:', err);
    return res.status(500).json({ error: err.message });
  }
}
