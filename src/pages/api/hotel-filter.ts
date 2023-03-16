import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '@/src/types/Response';
import HotelFilterOptions from '@/src/types/HotelFilterOptions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | HotelFilterOptions>,
) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const filters = await sql<HotelFilterOptions[]>`
      SELECT 	json_agg(DISTINCT z.*) AS zones,
          MAX(r.capacity) AS max_capacity,
          MAX(r.area) AS max_area,
          json_agg(DISTINCT ch.*) AS chains,
          json_agg(DISTINCT ca.*) AS categories,
          MAX(sizes.size) AS max_size,
          MAX(r.price) AS max_price
          
          FROM zones z, rooms r, hotel_chains ch, categories ca, (SELECT COUNT(room_id) AS size FROM rooms GROUP BY hotel_id) AS sizes
    `;

      if (filters.length) {
        res.status(200).json(filters[0]);
      }
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
