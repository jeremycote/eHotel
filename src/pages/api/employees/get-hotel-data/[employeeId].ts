import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Reservation } from '@/src/types/Reservation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reservation[]>,
) {
  const { employeeId } = req.query;

  if (employeeId) {
    const reservations: Reservation[] = await sql<Reservation[]>`
            SELECT r.reservation_id, r.room_id, r.price, r.archived, r.number_guests, json_agg(c.*) as client, json_agg(ro.*) as room
            FROM reservations r
                     LEFT JOIN clients c on c.client_id = r.client_id
                     LEFT JOIN rooms ro on ro.room_id = r.room_id
            WHERE ro.hotel_id = (SELECT hotel_id FROM employees WHERE employee_id = ${employeeId} LIMIT 1)
            GROUP BY r.reservation_id
        `;

    if (reservations?.length) {
      res.status(200).json(reservations);
    }
  }

  res.status(404);
}
