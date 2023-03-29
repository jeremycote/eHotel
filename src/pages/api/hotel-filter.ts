import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '@/src/types/Response';
import HotelFilterOptions from '@/src/types/HotelFilterOptions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | HotelFilterOptions>,
) {
  const { method } = req;

  console.log('Received');

  switch (method) {
    case 'GET': {
      const filters = await sql<HotelFilterOptions[]>`
      SELECT
          get_zones_json() AS zones,
          MAX(r.capacity) AS max_capacity,
          MAX(r.area) AS max_area,
          get_hotel_chains_json() AS chains,
          get_categories_json() AS categories,
          MAX(sizes.size) AS max_size,
          MAX(r.price) AS max_price
  
          FROM rooms r, (SELECT COUNT(room_id) AS size FROM rooms GROUP BY hotel_id) AS sizes
      `;

      if (filters.length) {
        console.log('Responded');
        res.status(200).json(filters[0]);
      } else {
        res.status(500).json({ error: true });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
