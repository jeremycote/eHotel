import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';
import HotelChain from '@/src/types/HotelChain';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelChain[]>,
) {
  res
    .status(200)
    .json(
      await sql<HotelChain[]>`SELECT * FROM hotel_chains ORDER BY chain_id`,
    );
}
