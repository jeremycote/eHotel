// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql from '@/src/lib/db';
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel>,
) {
  const { hotelId } = req.query;

  if (hotelId) {
    var hotels: Hotel[] = await sql<Hotel[]>`SELECT  hotels.*,
		COALESCE(ARRAY_AGG(DISTINCT hotel_categories.category_id) FILTER (WHERE hotel_categories.category_id IS NOT NULL), '{}') AS category_ids,
		COALESCE(ARRAY_AGG(DISTINCT hotel_images.url) FILTER (WHERE hotel_images.url IS NOT NULL), '{}') AS images,
		COALESCE(ARRAY_AGG(DISTINCT hotel_emails.email) FILTER (WHERE hotel_emails.email IS NOT NULL), '{}') AS emails,
    COALESCE(ARRAY_AGG(DISTINCT hotel_phone_numbers.phone_number) FILTER (WHERE hotel_phone_numbers.phone_number IS NOT NULL), '{}') AS phone_numbers

		FROM hotels
		LEFT JOIN hotel_categories ON hotels.hotel_id = hotel_categories.hotel_id
		LEFT JOIN hotel_emails ON hotels.hotel_id = hotel_emails.hotel_id
		LEFT JOIN hotel_images ON hotels.hotel_id = hotel_images.hotel_id
		LEFT JOIN hotel_phone_numbers ON hotels.hotel_id = hotel_phone_numbers.hotel_id

		WHERE hotels.hotel_id = ${hotelId}

		GROUP BY hotels.hotel_id
		ORDER BY hotels.hotel_id
		LIMIT 1`;

    if (hotels?.length) {
      res.status(200).json(hotels[0]);
    }
  }

  res.status(404);
}
