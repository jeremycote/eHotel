// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '@/src/types/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import sql from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.email === null || session?.user?.email === undefined) {
    res.status(401).end();
    return;
  }

  const users = await sql<
    User[]
  >`SELECT * FROM users WHERE email = ${session.user.email} LIMIT 1`;

  if (!users.length) {
    res.status(404).end();
    return;
  }

  res.status(200).json(users[0]);
}
