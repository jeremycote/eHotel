// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>,
) {
  const { getImages } = req.query;

  if (getImages === 'true') {
    res
      .status(200)
      .json(
        await sql<
          Hotel[]
        >`SELECT *, ARRAY_AGG(hotel_images.url) FROM hotels ON hotels.hotel_id = hotel_images.hotel_id GROUP BY hotels.hotel_id, hotel_images.hotel_image_id`,
      );
  } else {
    res
      .status(200)
      .json(await sql<Hotel[]>`SELECT * FROM hotels ORDER BY hotel_id`);
  }
}
