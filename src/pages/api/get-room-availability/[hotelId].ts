// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import RoomAvailability from '@/src/types/RoomAvailability';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoomAvailability[]>,
) {
  const { hotelId, available, startDate, endDate, roomTypeId } = req.query;

  if (!(startDate && endDate && available && hotelId)) {
    res.status(404).json([]);
  } else {
    let where = `r.hotel_id = ${hotelId}`;

    if (startDate && endDate) {
      where += ' AND r.room_id ';
      where += available === 'true' ? 'NOT IN ' : 'IN ';
      where += `(SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE (daterange(reservations.start_date, reservations.end_date) && daterange('${startDate}', '${endDate}')))`;
    }

    if (roomTypeId) {
      where += ` AND r.room_type_id = ${roomTypeId}`;
    }

    res.status(200).json(
      await sql.unsafe(
        `SELECT hotel_id, r.room_type_id, rt.name as room_type_name, count(room_id), min(r.price) as lowest_price
                    FROM rooms r
                    INNER JOIN room_types rt on rt.room_type_id = r.room_type_id
                    WHERE ${where} GROUP BY hotel_id, r.room_type_id, rt.name ORDER BY room_type_id
            `,
      ),
    );
  }
}
