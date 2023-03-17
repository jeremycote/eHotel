import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateResponse, ErrorResponse } from '@/src/types/Response';
import Employee from '@/src/types/Employee';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/pages/api/auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse | undefined>,
) {
  const session = await getServerSession(req, res, authOptions);

  let employees;

  if (!session?.user?.email) {
    res.status(403).json({ error: 'unauthorized' });
  } else {
    employees = await sql<
      Employee[]
    >`SELECT * FROM employees WHERE employee_id IN (SELECT user_id FROM users WHERE email = ${session.user.email})`;

    if (!employees.length) {
      res.status(403).json({ error: 'unauthorized' });
    }
  }

  const { query, method } = req;

  switch (method) {
    case 'POST':
      if (query.reservationId && employees && employees[0].employee_id) {
        const lease: CreateResponse[] = await sql<CreateResponse[]>`
                    INSERT INTO leases (reservation_id, employee_id, paid) VALUES (${query.reservationId}, ${employees[0].employee_id}, false) RETURNING lease_id;
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
