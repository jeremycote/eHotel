// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RoomType } from '@/src/types/RoomType';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoomType[]>,
) {
  res
    .status(200)
    .json(
      await sql<RoomType[]>`SELECT * FROM room_types ORDER BY room_type_id`,
    );
}
