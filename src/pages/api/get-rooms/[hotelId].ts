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
  const { hotelId, available, startDate, endDate, roomTypeId } = req.query;

  let where = `rooms.hotel_id = ${hotelId}`;

  if (startDate && endDate) {
    where += ' AND rooms.room_id ';
    where += available === 'true' ? 'NOT IN ' : 'IN ';
    where += `(SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE (daterange(reservations.start_date, reservations.end_date) && daterange('${startDate}', '${endDate}')))`;
  }

  if (roomTypeId) {
    where += ` AND rooms.room_type_id = ${roomTypeId}`;
  }

  if (hotelId) {
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
