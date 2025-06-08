import { NextApiRequest, NextApiResponse } from 'next';
import getHandler from './routes/get';
import postHandler from './routes/post';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getHandler(req, res);
    case 'POST':
      return postHandler(req, res);
    default:
      return res.status(405).json({ message: 'Método não permitido.' });
  }
}
