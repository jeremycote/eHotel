// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

import { debug } from 'console';
import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>,
) {
  const { getImages, getCategories, getPhoneNumbers, getEmails } = req.query;

  let columns = 'hotels.*';
  let from = 'hotels';

  if (getImages === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(hotel_images.url) FILTER (WHERE hotel_images.url IS NOT NULL), '{}') AS images";
    from +=
      ' LEFT JOIN hotel_images ON hotels.hotel_id = hotel_images.hotel_id';
  }

  if (getCategories === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(DISTINCT hotel_categories.category_id) FILTER (WHERE hotel_categories.category_id IS NOT NULL), '{}') AS category_ids";
    from +=
      ' LEFT JOIN hotel_categories ON hotels.hotel_id = hotel_categories.hotel_id';
  }

  let query = `SELECT ${columns} FROM ${from} GROUP BY hotels.hotel_id ORDER BY hotels.hotel_id`;
  debug(query);

  res.status(200).json(await sql.unsafe(query));
}
