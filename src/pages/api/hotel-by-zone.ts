// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import HotelByZone from '@/src/types/HotelByZone';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelByZone[]>,
) {
  const hbz: HotelByZone[] = await sql<
    HotelByZone[]
  >`SELECT * FROM hotels_by_zone`;

  if (hbz != null) {
    res.status(200).json(hbz);
  } else {
    res.status(500).json([]);
  }
}
