import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../../controllers/ClientController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid, name, accountType, eventType } = req.body;

  if (!uuid || !name || !accountType || !eventType) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }

  try {
    const result = await ClientController.handleClientEvent(
      uuid,
      name,
      accountType,
      eventType
    );
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API] Erro ao processar requisição:', err);
    return res.status(500).json({ error: err.message });
  }
}
