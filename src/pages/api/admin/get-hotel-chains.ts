import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../../lib/db';
import HotelChain from '@/src/types/HotelChain';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelChain[]>,
) {
  res.status(200).json(
    await sql<HotelChain[]>`
        SELECT 
            hc.chain_id, 
            hc.name, 
            hc.address,
            COALESCE(ARRAY_AGG(DISTINCT ce.email) FILTER (WHERE ce.email IS NOT NULL), '{}') AS emails,
            COALESCE(ARRAY_AGG(DISTINCT cpn.phone_number) FILTER (WHERE cpn.phone_number IS NOT NULL), '{}') AS phone_numbers
        FROM hotel_chains hc
        LEFT JOIN chain_emails ce on ce.chain_id = hc.chain_id
        LEFT JOIN chain_phone_numbers cpn on cpn.chain_id = hc.chain_id
        GROUP BY hc.chain_id, hc.name, hc.address
        ORDER BY chain_id
      `,
  );
}
