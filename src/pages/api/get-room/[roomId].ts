// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import { Room } from '@/src/types/Room';
import { debug } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../../lib/db';
import dayjs from 'dayjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room[]>,
) {
  const { roomId, available, startDate, endDate } = req.query;

  let where = `r.room_id = ${roomId}`;

  if (startDate && endDate) {
    where += ' AND r.room_id ';
    where += available === 'true' ? 'NOT IN ' : 'IN ';
    where += `(SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE reservations.start_date >= '${startDate}' AND (reservations.end_date IS NULL OR reservations.end_date <= '${endDate}'))`;
  }

  if (roomId && startDate && endDate) {
    const numberOfDays = Math.round(
      dayjs(String(endDate)).diff(String(startDate), 'days'),
    );
    res.status(200).json(
      await sql.unsafe(
        `SELECT 
                                r.room_id, 
                                h.name as hotel_name, 
                                h.stars as hotel_stars, 
                                h.address as hotel_address, 
                                r.price, 
                                r.price * ${numberOfDays} as full_price, 
                                r.capacity, 
                                r.extendable, 
                                r.damages, 
                                r.view, 
                                rt.name as room_type,
                                COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.amenity_id IS NOT NULL), '{}') as room_amenities
                            FROM rooms r 
                            INNER JOIN hotels h on h.hotel_id = r.hotel_id
                            INNER JOIN room_types rt on rt.room_type_id = r.room_type_id
                            LEFT JOIN room_amenities ra on ra.room_id = r.room_id
                            LEFT JOIN amenities a on a.amenity_id = ra.amenity_id
                            WHERE ${where}
                            GROUP BY r.room_id, h.name, h.stars, h.address, r.price, r.capacity, r.extendable, r.damages, r.view, rt.name
                            LIMIT 1`,
      ),
    );
  } else {
    res.status(404);
  }
}
