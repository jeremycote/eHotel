import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateResponse, ErrorResponse } from '@/src/types/Response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/pages/api/auth/[...nextauth]';
import dayjs from 'dayjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse | undefined>,
) {
  const { method } = req;
  const { roomId, startDate, endDate, numberGuests, fullPrice } = req.body;
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.email === null || session?.user?.email === undefined) {
    res.status(403).json({ error: 'unauthorized' });
  }

  switch (method) {
    case 'POST':
      if (
        roomId &&
        startDate &&
        endDate &&
        numberGuests &&
        fullPrice &&
        session?.user?.email
      ) {
        const expectedPricePerNight =
          fullPrice /
          Math.round(dayjs(String(endDate)).diff(String(startDate), 'days'));

        const availableRoomId = await sql`
                    SELECT r.room_id
                    FROM rooms r
                    WHERE price = ${expectedPricePerNight} and r.room_id = ${roomId}
                    AND r.room_id NOT IN (SELECT rooms.room_id FROM rooms JOIN reservations ON rooms.room_id = reservations.room_id WHERE reservations.start_date >= '${sql(
                      startDate,
                    )}' AND (reservations.end_date IS NULL OR reservations.end_date <= '${sql(
          endDate,
        )}'))
                `;
        if (
          availableRoomId.length &&
          String(availableRoomId[0]?.room_id) === String(roomId)
        ) {
          const reservation: CreateResponse[] = await sql<CreateResponse[]>`
                    INSERT INTO reservations (user_id, room_id, price, number_guests, start_date, end_date) VALUES ((SELECT user_id FROM users WHERE email = ${
                      session.user.email
                    } LIMIT 1), ${roomId}, ${fullPrice}, ${numberGuests}, '${sql(
            startDate,
          )}', '${sql(endDate)}') RETURNING reservation_id;
                `;

          if (reservation.length) {
            res.status(200).json(reservation[0]);
          }
        } else {
          res.status(422).json({
            error: 'The room not available at this price for these dates...',
          });
        }
        return;
      }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
