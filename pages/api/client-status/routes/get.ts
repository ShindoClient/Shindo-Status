import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../../controllers/ClientController';
import { ApiError } from '@/types';

export default async function handler(
  req: NextApiRequest & { params?: { uuid?: string } },
  res: NextApiResponse
) {
  try {
    // Aceita tanto req.params.uuid quanto req.query.uuid
    const uuid = req.params?.uuid || (req.query.uuid as string);
    if (!uuid) {
      return res.status(400).json({ message: 'UUID não informado' } as ApiError);
    }
    const result = await ClientController.getStatusByUuid(uuid);
    if (!result) {
      return res.status(404).json({ message: 'Client not found' } as ApiError);
    }
    return res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message } as ApiError);
  }
}
