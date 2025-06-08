import { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../../controllers/ClientController';
import { ApiError } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await ClientController.getAllStatus();
    return res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message } as ApiError);
  }
}
