import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateResponse, ErrorResponse } from '@/src/types/Response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/pages/api/auth/[...nextauth]';
import dayjs from 'dayjs';
import Employee from '@/src/types/Employee';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse | undefined>,
) {
  const { method } = req;
  const {
    name,
    address,
    nas,
    email,
    phone_number,
    room_id,
    number_guests,
    start_date,
    end_date,
    full_price,
  } = req.body;
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    res.status(403).json({ error: 'unauthorized' });
  } else {
    const employees = await sql<
      Employee[]
    >`SELECT * FROM employees WHERE employee_id IN (SELECT user_id FROM users WHERE email = ${session.user.email})`;

    if (!employees.length) {
      res.status(403).json({ error: 'unauthorized' });
    }
  }

  switch (method) {
    case 'POST':
      if (
        name &&
        address &&
        nas &&
        email &&
        phone_number &&
        room_id &&
        number_guests &&
        start_date &&
        end_date &&
        full_price &&
        session?.user?.email
      ) {
        await sql`
                    INSERT INTO users (name, address, nas, email, phone_number, password)
                    VALUES (${name}, ${address}, ${nas}, ${email}, ${phone_number}, crypt('client', gen_salt('bf')))
                    ON CONFLICT (email) DO NOTHING
                    RETURNING user_id
                `;
        const reservation: CreateResponse[] = await sql<CreateResponse[]>`
                        INSERT INTO reservations (user_id, room_id, price, number_guests, start_date, end_date) VALUES ((select user_id from users where email = ${email} LIMIT 1), ${room_id}, ${full_price}, ${number_guests}, ${start_date}, ${end_date}) RETURNING reservation_id as created;
                    `;

        if (reservation && reservation.length) {
          const lease: CreateResponse[] = await sql<CreateResponse[]>`
                            INSERT INTO leases (reservation_id, employee_id, paid) VALUES (${reservation[0].created}, (SELECT user_id FROM users WHERE email = ${session.user.email}), false) RETURNING lease_id;
                        `;
          res.status(200).json(lease[0]);
        } else {
          res.status(500).json({ error: 'an error occurred' });
        }
      } else {
        res.status(422).json({ error: 'missing params' });
      }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
