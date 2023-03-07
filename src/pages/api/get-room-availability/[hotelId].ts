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
    let where = `rooms.hotel_id = ${hotelId}`;

    if (startDate && endDate) {
      where += ' AND rooms.room_id ';
      where += available === 'true' ? 'NOT IN ' : 'IN ';
      where += `(SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE reservations.start_date >= '${startDate}' AND (reservations.end_date IS NULL OR reservations.end_date <= '${endDate}'))`;
    }

    if (roomTypeId) {
      where += ` AND rooms.room_type_id = ${roomTypeId}`;
    }

    res
      .status(200)
      .json(
        await sql.unsafe(
          `SELECT hotel_id, room_type_id, count(room_id) FROM rooms WHERE ${where} GROUP BY hotel_id, room_type_id ORDER BY room_type_id`,
        ),
      );
  }
}