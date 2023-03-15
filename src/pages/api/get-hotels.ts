// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Hotel } from '@/src/types/Hotel';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hotel[]>,
) {
  const {
    getImages,
    getCategories,
    getPhoneNumbers,
    getEmails,
    zone,
    capacity,
    area,
    chain,
    category,
    size,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  } = req.query;

  let columns =
    'hotels.*, (select min(price) from rooms where hotel_id = hotels.hotel_id) as lowest_price';
  let from = 'hotels';

  let where = 'WHERE true';

  if (getImages === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(DISTINCT hotel_images.url) FILTER (WHERE hotel_images.url IS NOT NULL), '{}') AS images";
    from +=
      ' LEFT JOIN hotel_images ON hotels.hotel_id = hotel_images.hotel_id';
  }

  if (getCategories === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(DISTINCT hotel_categories.category_id) FILTER (WHERE hotel_categories.category_id IS NOT NULL), '{}') AS category_ids";
    from +=
      ' LEFT JOIN hotel_categories ON hotels.hotel_id = hotel_categories.hotel_id';
  }

  if (getPhoneNumbers === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(DISTINCT hotel_phone_numbers.phone_number) FILTER (WHERE hotel_phone_numbers.phone_number IS NOT NULL), '{}') AS phone_numbers";
    from +=
      ' LEFT JOIN hotel_phone_numbers ON hotels.hotel_id = hotel_phone_numbers.hotel_id';
  }

  if (getEmails === 'true') {
    columns +=
      ", COALESCE(ARRAY_AGG(DISTINCT hotel_emails.email) FILTER (WHERE hotel_emails.email IS NOT NULL), '{}') AS emails";
    from +=
      ' LEFT JOIN hotel_emails ON hotels.hotel_id = hotel_emails.hotel_id';
  }

  if (zone != null) {
    where += ` AND hotels.zone_id IN (SELECT zone_id FROM zones WHERE name = '${zone}')`;
  }

  if (capacity != null) {
    where += ` AND hotels.hotel_id IN (SELECT hotel_id FROM rooms WHERE capacity >= '${capacity}')`;
  }

  if (area != null) {
    where += ` AND hotels.hotel_id IN (SELECT hotel_id FROM rooms WHERE area >= '${area}')`;
  }

  if (chain != null) {
    where += ` AND hotels.chain_id = '${chain}'`;
  }

  if (category != null) {
    where += ` AND hotels.hotel_id IN (SELECT hotel_id FROM hotel_categories WHERE category_id = ${category})`;
  }

  if (size != null) {
    where += ` AND hotels.hotel_id IN (
      SELECT hotels.hotel_id FROM hotels JOIN rooms ON hotels.hotel_id = rooms.hotel_id
      GROUP BY hotels.hotel_id
      HAVING COUNT(DISTINCT rooms.room_id) >= '${size}'
    )`;
  }

  if (minPrice != null) {
    where += ` AND hotels.hotel_id IN (
      SELECT hotels.hotel_id FROM hotels JOIN rooms ON hotels.hotel_id = rooms.hotel_id
      WHERE rooms.price >= '${minPrice}'
    )`;
  }

  if (maxPrice != null) {
    where += ` AND hotels.hotel_id IN (
      SELECT hotels.hotel_id FROM hotels JOIN rooms ON hotels.hotel_id = rooms.hotel_id
      WHERE rooms.price <= '${maxPrice}'
    )`;
  }

  if (startDate != null && endDate != null) {
    where += ` AND hotels.hotel_id IN (
      SELECT rooms.hotel_id FROM rooms WHERE rooms.room_id NOT IN (
        SELECT room_id FROM reservations WHERE start_date >= '${startDate}' AND start_date <= '${endDate}'
      )
    )`;
  }

  let query = `SELECT ${columns} FROM ${from} ${
    where != 'WHERE' ? where : ''
  } GROUP BY hotels.hotel_id ORDER BY hotels.hotel_id`;
  console.log(query);

  res.status(200).json(await sql.unsafe(query));
}
