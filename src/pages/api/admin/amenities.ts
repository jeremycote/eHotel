import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateResponse,
  ErrorResponse,
  UpdatedResponse,
} from '@/src/types/Response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/pages/api/auth/[...nextauth]';
import Employee from '@/src/types/Employee';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateResponse | ErrorResponse | { amenity_id: number; name: string }[]
  >,
) {
  const { method } = req;
  const { amenity } = req.body;
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
    case 'GET': {
      res.status(200).json(
        await sql<{ amenity_id: number; name: string }[]>`
        SELECT 
            a.amenity_id,
            a.name
        FROM amenities a
        ORDER BY a.amenity_id`,
      );
      break;
    }
    case 'POST': {
      if (amenity) {
        const roomType: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO amenities (name) VALUES (${amenity}) RETURNING amenity_id as created`;
        if (roomType[0].created) {
          res.status(200).json(roomType[0]);
        } else {
          res.status(500).json({ error: 'Error while creating the Amenity' });
        }
      } else {
        res.status(422).json({ error: 'Missing Amenity' });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
