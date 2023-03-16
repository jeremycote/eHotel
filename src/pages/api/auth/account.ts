import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateResponse, ErrorResponse } from '@/src/types/Response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponse | ErrorResponse>,
) {
  const { method } = req;

  // TODO: Pass password in a more secure manor.
  const { name, address, nas, email, phone_number, password } = req.body;

  console.log(req.body);

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
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
