// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Category } from '@/src/types/Category';
import type { NextApiRequest, NextApiResponse } from 'next';

import sql from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[]>,
) {
  res
    .status(200)
    .json(await sql<Category[]>`SELECT * FROM categories ORDER BY category_id`);
}
