import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateResponse,
  ErrorResponse,
  UpdatedResponse,
} from '@/src/types/Response';
import Zone from '@/src/types/Zone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | Zone[]>,
) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      res
        .status(200)
        .json(await sql<Zone[]>`SELECT * FROM zones ORDER BY zone_id`);
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
