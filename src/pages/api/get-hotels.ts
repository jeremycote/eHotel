// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>,
) {
  const { getImages, getCategories, getPhoneNumbers, getEmails } = req.query;

  var query = sql<Hotel[]>`SELECT hotels.* `;

  if (getImages === 'true') {
    query +=
      ", COALESCE(ARRAY_AGG(hotel_images.url) FILTER (WHERE hotel_images.url IS NOT NULL), '{}') AS images";
  }

  query += 'FROM hotels';

  if (getImages === 'true') {
    query +=
      ' LEFT JOIN hotel_images ON hotels.hotel_id = hotel_images.hotel_id';
  }

  res.status(200).json(await query);
}
