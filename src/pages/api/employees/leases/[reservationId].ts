import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateResponse, ErrorResponse } from '@/src/types/Response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse | undefined>,
) {
  const { query, method } = req;

  switch (method) {
    // case 'GET':
    //     // Get data from your database
    //     res.status(200).json({ id, name: `User ${id}` })
    //     break
    case 'POST':
      if (query.reservationId && query.employeeId) {
        const lease: CreateResponse[] = await sql<CreateResponse[]>`
                    INSERT INTO leases (reservation_id, employee_id, paid) VALUES (${query.reservationId}, ${query.employeeId}, false) RETURNING lease_id;
                `;

        if (lease.length) {
          res.status(200).json(lease[0]);
        }
      }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
