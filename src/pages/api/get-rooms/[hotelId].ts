// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import { Room } from '@/src/types/Room';
import { debug } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room[]>,
) {
  const { hotelId, available, startDate, endDate } = req.query;

  let where = `rooms.hotel_id = ${hotelId}`;

  if (startDate && endDate) {
    where += ' AND rooms.room_id ';
    where += available === 'true' ? 'NOT IN ' : 'IN ';
    where += `(SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE reservations.start_date >= '${startDate}' AND (reservations.end_date IS NULL OR reservations.end_date <= '${endDate}'))`;
  }

  if (hotelId) {
    debug(`SELECT * FROM rooms WHERE ${where} ORDER BY rooms.room_id`);
    res
      .status(200)
      .json(
        await sql.unsafe(
          `SELECT * FROM rooms WHERE ${where} ORDER BY rooms.room_id`,
        ),
      );
  } else {
    res.status(404);
  }
}
