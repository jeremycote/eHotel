import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import Reservation from '@/src/types/Reservation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reservation[]>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.email != null) {
    const reservations: Reservation[] = await sql<Reservation[]>`
              SELECT r.reservation_id, r.room_id, r.price, r.archived, r.number_guests, json_agg(u.*) as user, json_agg(ro.*) as room
              FROM reservations r
                       LEFT JOIN users u on u.user_id = r.user_id
                       LEFT JOIN rooms ro on ro.room_id = r.room_id
              WHERE ro.hotel_id = (SELECT hotel_id FROM employees WHERE employee_id IN (
                SELECT employee_id FROM employees WHERE employee_id IN (
                    SELECT user_id FROM users WHERE email = ${
                      session!.user.email
                    }
                ) LIMIT 1
              ) LIMIT 1)
              GROUP BY r.reservation_id
          `;

    if (reservations != null) {
      res.status(200).json(reservations);
    } else {
      res.status(401);
    }
  } else {
    res.status(401);
  }

  res.end();
}
