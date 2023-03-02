// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '@/src/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel>,
) {
  const { hotelId } = req.query;

  if (hotelId) {
    var hotels: Hotel[] = await sql<
      Hotel[]
    >`SELECT * FROM hotels WHERE hotel_id = ${hotelId} LIMIT 1`;

    if (hotels?.length) {
      res.status(200).json(hotels[0]);
    }
  }

  res.status(404);
}
