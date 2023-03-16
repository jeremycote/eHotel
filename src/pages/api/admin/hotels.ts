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
import { Hotel } from '@/src/types/Hotel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateResponse | UpdatedResponse | ErrorResponse | Hotel[]
  >,
) {
  const { method } = req;
  const {
    hotel_id,
    name,
    address,
    stars,
    zone_id,
    chain_id,
    phone_numbers,
    emails,
    images,
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
    case 'PUT': {
      if (
        hotel_id &&
        name &&
        address &&
        phone_numbers.length &&
        emails.length
      ) {
        const hotel: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE hotels SET name = ${name}, address = ${address}, zone_id = ${zone_id}, stars = ${stars}, chain_id = ${chain_id} WHERE hotel_id = ${hotel_id} RETURNING hotel_id as updated`;

        if (hotel[0].updated) {
          await sql`DELETE FROM hotel_phone_numbers WHERE hotel_id = ${hotel_id}`;
          const phoneNumbersResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                        INSERT INTO hotel_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              hotel_id: hotel[0].updated,
                            };
                          }),
                        )};
                    `;

          await sql`DELETE FROM hotel_emails WHERE hotel_id = ${hotel_id}`;
          const emailsResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                    INSERT INTO hotel_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          hotel_id: hotel[0].updated,
                        };
                      }),
                    )};
                `;

          await sql`DELETE FROM hotel_images WHERE hotel_id = ${hotel_id}`;
          const imagesResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                    INSERT INTO hotel_images ${sql(
                      images.map((e: string) => {
                        return {
                          url: e,
                          hotel_id: hotel[0].updated,
                        };
                      }),
                    )};
                `;

          if (
            hotel.length &&
            phoneNumbersResponse &&
            emailsResponse &&
            imagesResponse
          ) {
            res.status(200).json(hotel[0]);
          }
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      }
      break;
    }
    case 'POST': {
      if (
        name &&
        address &&
        chain_id &&
        zone_id &&
        stars &&
        phone_numbers.length &&
        emails.length
      ) {
        const hotel: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO hotels (name, address, zone_id, stars, chain_id) VALUES (${name}, ${address}, ${zone_id}, ${stars}, ${chain_id}) RETURNING hotel_id as created`;

        if (hotel[0].created) {
          const phoneNumbersResponse: CreateResponse[] = await sql<
            CreateResponse[]
          >`
                        INSERT INTO hotel_phone_numbers ${sql(
                          phone_numbers.map((p: string) => {
                            return {
                              phone_number: p,
                              hotel_id: hotel[0].created,
                            };
                          }),
                        )};
                    `;

          const emailsResponse: CreateResponse[] = await sql<CreateResponse[]>`
                    INSERT INTO hotel_emails ${sql(
                      emails.map((e: string) => {
                        return {
                          email: e,
                          hotel_id: hotel[0].created,
                        };
                      }),
                    )};
                `;

          const imagesResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
                    INSERT INTO hotel_images ${sql(
                      images.map((e: string) => {
                        return {
                          url: e,
                          hotel_id: hotel[0].created,
                        };
                      }),
                    )};
                `;

          if (
            hotel.length &&
            phoneNumbersResponse &&
            emailsResponse &&
            imagesResponse
          ) {
            res.status(200).json(hotel[0]);
          }
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      }
      break;
    }
    case 'DELETE': {
      if (hotel_id) {
        try {
          await sql`DELETE FROM hotel_phone_numbers WHERE hotel_id = ${hotel_id}`;
          await sql`DELETE FROM hotel_emails WHERE hotel_id = ${hotel_id}`;
          await sql`DELETE FROM hotel_images WHERE hotel_id = ${hotel_id}`;
          await sql`DELETE FROM hotels WHERE hotel_id = ${hotel_id}`;
          res.status(200).json({ updated: hotel_id });
        } catch (err) {
          res.status(422).json({ error: "Couldn't save" });
        }
      }
      break;
    }
    case 'GET': {
      res.status(200).json(
        await sql<Hotel[]>`
        SELECT 
            h.hotel_id,
            h.chain_id, 
            h.name, 
            h.address,
            h.stars,
            h.zone_id,
            COALESCE(ARRAY_AGG(DISTINCT ce.email) FILTER (WHERE ce.email IS NOT NULL), '{}') AS emails,
            COALESCE(ARRAY_AGG(DISTINCT cpn.phone_number) FILTER (WHERE cpn.phone_number IS NOT NULL), '{}') AS phone_numbers,
            COALESCE(ARRAY_AGG(DISTINCT hi.url) FILTER (WHERE hi.url IS NOT NULL), '{}') AS images
        FROM hotels h
        LEFT JOIN hotel_emails ce on ce.hotel_id = h.hotel_id
        LEFT JOIN hotel_phone_numbers cpn on cpn.hotel_id = h.hotel_id
        LEFT JOIN hotel_images hi on h.hotel_id = hi.hotel_id
        GROUP BY h.hotel_id, h.chain_id, h.name, h.address, h.stars, h.zone_id
        ORDER BY hotel_id`,
      );
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
