import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const base = process.env.WS_GATEWAY_HTTP_BASE;
  const key = process.env.WS_GATEWAY_ADMIN_KEY;
  if (!base || !key) return res.status(400).json({ success: false, message: 'Gateway env not configured' });

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/v1/broadcast`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-key': key
      },
      body: JSON.stringify(req.body || {})
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || 'Gateway request failed' });
  }
}
