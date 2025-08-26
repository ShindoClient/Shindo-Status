import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const base = process.env.WS_GATEWAY_HTTP_BASE;
  if (!base) return res.status(200).json({ success: false, users: [], message: 'WS gateway not configured' });

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/v1/connected-users`, { headers: { 'Accept': 'application/json' } });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Gateway request failed' });
  }
}
