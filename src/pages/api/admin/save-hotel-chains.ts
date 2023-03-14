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
    CreateResponse | UpdatedResponse | ErrorResponse | undefined
  >,
) {
  const { method } = req;
  const { chain_id, name, address, phone_numbers, emails } = req.body;
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
    case 'PUT': {
      if (
        chain_id &&
        name &&
        address &&
        phone_numbers.length &&
        emails.length
      ) {
        const hotelChain: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE hotel_chains SET name = ${name}, address = ${address} WHERE chain_id = ${chain_id} RETURNING chain_id as updated`;

        if (hotelChain[0].updated) {
          await sql`DELETE FROM chain_phone_numbers WHERE chain_id = ${chain_id}`;
          const phoneNumbersResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                        INSERT INTO chain_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              chain_id: hotelChain[0].updated,
                            };
                          }),
                        )};
                    `;

          await sql`DELETE FROM chain_emails WHERE chain_id = ${chain_id}`;
          const emailsResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                    INSERT INTO chain_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          chain_id: hotelChain[0].updated,
                        };
                      }),
                    )};
                `;

          if (hotelChain.length && phoneNumbersResponse && emailsResponse) {
            res.status(200).json(hotelChain[0]);
          }
        } else {
          res.status(422).json({ error: "Couldn't save" });
        }
      }
      break;
    }
    case 'POST': {
      if (name && address && phone_numbers.length && emails.length) {
        const hotelChain: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO hotel_chains (name, address) VALUES (${name}, ${address}) RETURNING chain_id as created`;

        if (hotelChain[0].created) {
          const phoneNumbersResponse: CreateResponse[] = await sql<
            CreateResponse[]
          >`
                        INSERT INTO chain_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              chain_id: hotelChain[0].created,
                            };
                          }),
                        )};
                    `;

          const emailsResponse: CreateResponse[] = await sql<CreateResponse[]>`
                    INSERT INTO chain_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          chain_id: hotelChain[0].created,
                        };
                      }),
                    )};
                `;

          if (hotelChain.length && phoneNumbersResponse && emailsResponse) {
            res.status(200).json(hotelChain[0]);
          }
        } else {
          res.status(422).json({ error: "Couldn't save" });
        }
      }
      break;
    }
    case 'DELETE': {
      if (chain_id) {
        try {
          await sql`DELETE FROM chain_phone_numbers WHERE chain_id = ${chain_id}`;
          await sql`DELETE FROM chain_emails WHERE chain_id = ${chain_id}`;
          await sql`DELETE FROM hotel_chains WHERE chain_id = ${chain_id}`;
          res.status(200).json({ updated: chain_id });
        } catch (err) {
          res.status(422).json({ error: "Couldn't save" });
        }
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
