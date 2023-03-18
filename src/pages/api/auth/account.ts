import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateResponse,
  ErrorResponse,
  UpdatedResponse,
} from '@/src/types/Response';
import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]';
import User from '@/src/types/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse | UpdatedResponse | User>,
) {
  const { method } = req;

  const session = await getServerSession(req, res, authOptions);

  if (method != 'POST' && !session?.user?.email) {
    res.status(403).json({ error: 'unauthorized' });
  }

  // TODO: Pass password in a more secure manor.
  const { name, address, nas, email, phone_number, password } = req.body;

  switch (method) {
    case 'POST': {
      if (name && address && nas && email && phone_number && password) {
        const user: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO users (name, address, nas, email, phone_number, password) VALUES (${name}, ${address}, ${nas}, ${email}, ${phone_number}, crypt(${password}, gen_salt('bf'))) RETURNING user_id as created`;
        if (user.length) {
          res.status(200).json(user[0]);
        }
      } else {
        res.status(422).json({ error: 'Invalid req body' });
      }

      break;
    }
    case 'GET': {
      if (session?.user?.email) {
        const user = await sql<
          User[]
        >`SELECT * FROM users WHERE email = ${session.user.email}`;

        if (user.length) {
          res.status(200).json(user[0]);
        } else {
          res.status(422).json({ error: 'error while getting' });
        }
      }
      break;
    }
    case 'PUT': {
      if (
        session?.user?.email &&
        name &&
        address &&
        nas &&
        email &&
        phone_number
      ) {
        const user: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE users SET name = ${name}, address = ${address}, nas = ${nas}, email = ${email}, phone_number = ${phone_number} WHERE email = ${session.user.email} RETURNING user_id as updated`;

        if (user.length) {
          res.status(200).json(user[0]);
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
