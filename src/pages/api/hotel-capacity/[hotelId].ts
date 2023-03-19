// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql from '@/src/lib/db';
import { HotelRoomCapacity } from '@/src/types/HotelRoomCapacity';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HotelRoomCapacity[]>,
) {
  const { hotelId } = req.query;

  if (hotelId) {
    var capacities: HotelRoomCapacity[] = await sql<
      HotelRoomCapacity[]
    >`SELECT * FROM room_capacities_by_hotel WHERE hotel_id = ${hotelId} ORDER BY room_id`;

    if (capacities?.length) {
      res.status(200).json(capacities);
    }
  }

  res.status(404);
}
