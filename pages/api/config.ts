import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  return res.status(200).json({
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || null
  });
}
