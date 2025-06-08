import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../../controllers/ClientController';
import { ApiError } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid, name, accountType, eventType } = req.body;

  if (!uuid || !name || !accountType || !eventType) {
    return res.status(400).json({ message: 'Dados incompletos.' } as ApiError);
  }

  try {
    const result = await ClientController.handleClientEvent(
      uuid,
      name,
      accountType,
      eventType
    );
    return res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message } as ApiError);
  }
}
