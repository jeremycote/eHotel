// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import { Room } from '@/src/types/Room';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room[]>,
) {
  const { hotelId } = req.query;

  if (hotelId) {
    res
      .status(200)
      .json(
        await sql`SELECT * FROM rooms WHERE hotel_id = ${hotelId} ORDER BY rooms.room_id`,
      );
  } else {
    res.status(404);
  }
}
