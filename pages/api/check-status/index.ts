import { NextApiRequest, NextApiResponse } from 'next';
import { HealthController } from '../../../controllers/HealthController';
import { ApiError } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ message: 'Método não permitido.' } as ApiError);
  }

  try {
    const result = await HealthController.check();
    return res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message } as ApiError);
  }
}
