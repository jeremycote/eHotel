// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Reservation, { FullReservationDetails } from '@/src/types/Reservation';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import sql from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reservation[] | FullReservationDetails[]>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.email === null || session?.user?.email === undefined) {
    res.status(401).end();
    return;
  }

  const { details } = req.query;

  if (details === null || details === 'false') {
    const reservations = await sql<
      Reservation[]
    >`SELECT * FROM reservations WHERE user_id IN (SELECT user_id FROM users WHERE email = '${session.user.email}'`;

    res.status(200).json(reservations);
  } else {
    const reservations = await sql<
      FullReservationDetails[]
    >`SELECT reservations.reservation_id, hotels.name AS hotel_name, room_types.name AS room_type, reservations.price, reservations.number_guests, reservations.start_date, reservations.end_date FROM reservations INNER JOIN rooms ON reservations.room_id = rooms.room_id INNER JOIN room_types ON rooms.room_type_id = room_types.room_type_id INNER JOIN hotels ON hotels.hotel_id = rooms.hotel_id WHERE user_id IN (SELECT user_id FROM users WHERE email = ${session.user.email})`;

    res.status(200).json(reservations);
  }
}
