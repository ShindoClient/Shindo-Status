import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../../controllers/ClientController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await ClientController.getAllStatus();
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API] Erro ao buscar status dos clientes:', err);
    return res.status(500).json({ error: err.message });
  }
}
