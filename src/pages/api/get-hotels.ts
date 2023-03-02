// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>,
) {
  res
    .status(200)
    .json(await sql<Hotel[]>`SELECT * FROM hotels ORDER BY hotel_id`);
}
