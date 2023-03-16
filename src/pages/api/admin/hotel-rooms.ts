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
import { Room } from '@/src/types/Room';

export interface RoomData {
  rooms: Room[];
  hotels: { hotel_id: number; name: string }[];
  amenities: { amenity_id: number; name: string }[];
  room_types: { room_type_id: number; name: string }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateResponse | UpdatedResponse | ErrorResponse | RoomData
  >,
) {
  const { method } = req;
  const { hotelId } = req.query;
  const { room_id, hotel_id, price, capacity, extendable, view, room_type_id } =
    req.body;
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
        >`UPDATE hotels SET name = ${name}, address = ${address}, zone = ${zone}, stars = ${stars}, chain_id = ${chain_id} WHERE hotel_id = ${hotel_id} RETURNING hotel_id as updated`;

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
        zone &&
        stars &&
        phone_numbers.length &&
        emails.length
      ) {
        const hotel: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO hotels (name, address, zone, stars, chain_id) VALUES (${name}, ${address}, ${zone}, ${stars}, ${chain_id}) RETURNING hotel_id as created`;

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
      if (room_id) {
        try {
          await sql`DELETE FROM room_amenities WHERE room_id = ${room_id}`;
          await sql`DELETE FROM rooms WHERE room_id = ${room_id}`;
          res.status(200).json({ updated: room_id });
        } catch (err) {
          res.status(422).json({ error: "Couldn't save" });
        }
      }
      break;
    }
    case 'GET': {
      if (!hotelId) {
        return res.status(422).json({ error: 'Missing hotelId' });
      }
      const rooms: Room[] = await sql<Room[]>`
        SELECT 
            r.room_id,
            r.hotel_id,
            r.price,
            r.view,
            COALESCE(r.damages, ''),
            r.extendable,
            r.capacity,
            rt.name,
            COALESCE(ARRAY_AGG(DISTINCT a.amenity_id) FILTER (WHERE a.amenity_id IS NOT NULL), '{}') AS amenities
        FROM rooms r
        LEFT JOIN room_types rt on rt.room_type_id = r.room_type_id
        LEFT JOIN room_amenities ra on r.room_id = ra.room_id
        LEFT JOIN amenities a on a.amenity_id = ra.amenity_id
        WHERE hotel_id = ${hotelId}
        GROUP BY r.room_id, r.hotel_id, r.price, r.view, r.damages, r.extendable, r.capacity, rt.name
        ORDER BY room_id`;

      const hotels = await sql<{ hotel_id: number; name: string }[]>`
        SELECT 
            h.hotel_id,
            h.name
        FROM hotels h
        ORDER BY h.hotel_id`;

      const amenities = await sql<{ amenity_id: number; name: string }[]>`
        SELECT 
            a.amenity_id,
            a.name
        FROM amenities a
        ORDER BY a.amenity_id`;

      const roomTypes = await sql<{ room_type_id: number; name: string }[]>`
        SELECT 
            rt.room_type_id,
            rt.name
        FROM room_types rt
        ORDER BY rt.room_type_id`;

      res.status(200).json({
        rooms: rooms,
        hotels: hotels,
        amenities: amenities,
        room_types: roomTypes,
      });
      break;
    }
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
