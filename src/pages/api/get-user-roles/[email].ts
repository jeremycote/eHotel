// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sql from '@/src/lib/db';
import Employee from '@/src/types/Employee';
import UserRole from '@/src/types/UserRole';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserRole[]>,
) {
  const { email } = req.query;

  if (email === null || email === undefined || email === '') {
    res.status(404).end();
    return;
  }

  const employees = await sql<
    Employee[]
  >`SELECT * FROM employees WHERE employee_id IN (SELECT user_id FROM users WHERE email = ${email})`;

  const roles: UserRole[] = [];

  if (employees.length) {
    roles.push(UserRole.Employee);
  } else {
    roles.push(UserRole.Client);
  }

  res.status(roles.length ? 200 : 404).json(roles);
}
