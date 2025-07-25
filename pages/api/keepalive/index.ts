import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../controllers/ClientController';
import { ApiError } from '@/types';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { uuid } = req.body;
  if (!uuid) {
    return res.status(400).json({ message: 'UUID não informado' } as ApiError);
  }

  try {
    await ClientController.updateLastSeen(uuid);
    return res.status(200).json({ message: 'KeepAlive registrado' });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message } as ApiError);
  }
}