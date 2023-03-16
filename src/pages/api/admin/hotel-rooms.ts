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
  const {
    room_id,
    hotel_id,
    price,
    capacity,
    extendable,
    damages,
    view,
    room_type_id,
    amenities,
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
        room_id &&
        hotel_id &&
        price &&
        capacity &&
        (extendable != null || extendable != undefined) &&
        view &&
        room_type_id
      ) {
        const room: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE rooms SET hotel_id = ${hotel_id}, price = ${price}, capacity = ${capacity}, extendable = ${extendable}, damages = ${
          damages ?? ''
        }, view = ${view}, room_type_id = ${room_type_id} WHERE room_id = ${room_id} RETURNING room_id as updated`;

        if (room[0].updated && amenities.length) {
          await sql`DELETE FROM room_amenities WHERE room_id = ${room_id}`;
          const amenitiesResponse: UpdatedResponse[] = await sql<
            UpdatedResponse[]
          >`
              INSERT INTO room_amenities ${sql(
                amenities.map((p: string) => {
                  return {
                    room_id: room_id,
                    amenity_id: p,
                  };
                }),
              )};
                    `;

          if (room.length && (!amenities.length || amenitiesResponse)) {
            res.status(200).json(room[0]);
          } else {
            res.status(500).json({ error: 'Cannot save' });
          }
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      } else {
        res.status(422).json({ error: 'Missing params' });
      }
      break;
    }
    case 'POST': {
      if (hotel_id && price && capacity && extendable && view && room_type_id) {
        const room: CreateResponse[] = await sql<
          CreateResponse[]
        >`INSERT INTO rooms (hotel_id, price, capacity, extendable, damages, view, room_type_id) VALUES (${hotel_id}, ${price}, ${capacity}, ${extendable}, ${damages}, ${view}, ${room_type_id}) RETURNING room_id as created`;

        if (room[0].created && amenities.length) {
          const roomAmentities: CreateResponse[] = await sql<CreateResponse[]>`
                        INSERT INTO room_amenities ${sql(
                          amenities.map((p: string) => {
                            return {
                              room_id: room[0].created,
                              amenity_id: p,
                            };
                          }),
                        )};
                    `;
          if (room.length && (roomAmentities || !amenities.length)) {
            res.status(200).json(room[0]);
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
            r.room_type_id,
            r.room_type_id,
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
