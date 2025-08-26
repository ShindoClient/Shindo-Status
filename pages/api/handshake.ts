import type { NextApiRequest, NextApiResponse } from 'next';
import { db, admin } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  let firestore = false;
  try {
    if (db) {
      await db.collection('__health').doc('ping').set({
        t: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      firestore = true;
    }
  } catch {}

  return res.status(200).json({
    success: true,
    message: 'Handshake successful',
    firestore,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || null,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_BUILD_ID || null
  });
}
