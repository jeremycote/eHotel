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
import HotelChain from '@/src/types/HotelChain';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateResponse | UpdatedResponse | ErrorResponse | HotelChain[]
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
      if (chain_id && name && address) {
        const hotelChain: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE hotel_chains SET name = ${name}, address = ${address} WHERE chain_id = ${chain_id} RETURNING chain_id as updated`;

        if (hotelChain[0].updated) {
          await sql`DELETE FROM chain_phone_numbers WHERE chain_id = ${chain_id}`;
          if (phone_numbers && phone_numbers.length) {
            await sql<UpdatedResponse[]>`
                        INSERT INTO chain_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              chain_id: hotelChain[0].updated,
                            };
                          }),
                        )};`;
          }

          await sql`DELETE FROM chain_emails WHERE chain_id = ${chain_id}`;
          if (emails && emails.length) {
            await sql<UpdatedResponse[]>`
                    INSERT INTO chain_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          chain_id: hotelChain[0].updated,
                        };
                      }),
                    )};`;
          }

          if (hotelChain.length) {
            res.status(200).json(hotelChain[0]);
          }
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      }
      break;
    }
    case 'POST': {
      if (name && address) {
        const hotelChain: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO hotel_chains (name, address) VALUES (${name}, ${address}) RETURNING chain_id as created`;

        if (hotelChain[0].created) {
          if (phone_numbers && phone_numbers.length) {
            await sql<CreateResponse[]>`
                        INSERT INTO chain_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              chain_id: hotelChain[0].created,
                            };
                          }),
                        )};`;
          }

          if (emails && emails.length) {
            await sql<CreateResponse[]>`
                    INSERT INTO chain_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          chain_id: hotelChain[0].created,
                        };
                      }),
                    )};`;
          }

          if (hotelChain.length) {
            res.status(200).json(hotelChain[0]);
          }
        } else {
          res.status(422).json({ error: 'error while saving' });
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
    case 'GET': {
      res.status(200).json(
        await sql<HotelChain[]>`
        SELECT 
            hc.chain_id, 
            hc.name, 
            hc.address,
            COALESCE(ARRAY_AGG(DISTINCT ce.email) FILTER (WHERE ce.email IS NOT NULL), '{}') AS emails,
            COALESCE(ARRAY_AGG(DISTINCT cpn.phone_number) FILTER (WHERE cpn.phone_number IS NOT NULL), '{}') AS phone_numbers
        FROM hotel_chains hc
        LEFT JOIN chain_emails ce on ce.chain_id = hc.chain_id
        LEFT JOIN chain_phone_numbers cpn on cpn.chain_id = hc.chain_id
        GROUP BY hc.chain_id, hc.name, hc.address
        ORDER BY chain_id
      `,
      );
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
