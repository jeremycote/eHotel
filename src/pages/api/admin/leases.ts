import sql from '@/src/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateResponse,
  ErrorResponse,
  UpdatedResponse,
} from '@/src/types/Response';
import Employee from '@/src/types/Employee';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/pages/api/auth/[...nextauth]';
import { FullLease } from '@/src/types/Lease';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateResponse | UpdatedResponse | ErrorResponse | FullLease[]
  >,
) {
  const session = await getServerSession(req, res, authOptions);

  let employees;

  if (!session?.user?.email) {
    res.status(403).json({ error: 'unauthorized' });
  } else {
    employees = await sql<
      Employee[]
    >`SELECT * FROM employees WHERE employee_id IN (SELECT user_id FROM users WHERE email = ${session.user.email})`;

    if (!employees.length) {
      res.status(403).json({ error: 'unauthorized' });
    }
  }

  const { method } = req;
  const { lease_id } = req.body;

  switch (method) {
    case 'PUT': {
      if (lease_id) {
        const lease: UpdatedResponse[] = await sql<
          UpdatedResponse[]
        >`UPDATE leases
                  SET paid         = true
                  WHERE lease_id = ${lease_id}
                  RETURNING lease_id as updated`;

        if (lease.length) {
          res.status(200).json(lease[0]);
        } else {
          res.status(422).json({ error: 'error while saving' });
        }
      }
      break;
    }
    case 'GET': {
      if (employees && employees[0].employee_id) {
        const reservations: FullLease[] = await sql<FullLease[]>`
                  SELECT json_build_object(
                      'reservation_id', r.reservation_id, 
                      'room_id', r.room_id, 
                      'price', r.price, 
                      'archived', r.archived, 
                      'number_guests',r.number_guests, 
                      'start_date', r.start_date, 
                      'end_date', r.end_date, 
                      'client', json_agg(json_build_object(
                                  'name', u.name,
                                  'user_id', u.user_id,
                                  'address', u.address,
                                  'phone_number', u.phone_number,
                                  'email', u.email
                              )),
                      'room', json_agg(json_build_object(
                                  'room_id', ro.room_id,
                                  'hotel_id', ro.hotel_id,
                                  'price', ro.price,
                                  'capacity', ro.capacity,
                                  'extendable', ro.extendable,
                                  'damages', ro.damages,
                                  'view', ro.view,
                                  'room_type_id', ro.room_type_id,
                                  'area', ro.area
                              ))
                  ) as reservation,
                         json_build_object(
                                 'name', eu.name,
                                 'id', eu.user_id,
                                 'address', eu.address,
                                 'phone_number', eu.phone_number,
                                 'email', eu.email
                             ) as employee,
                  l.lease_id,
                  l.paid,
                  l.archived
                  FROM leases l
                  LEFT JOIN reservations r on r.reservation_id = l.reservation_id
                  LEFT JOIN users u on u.user_id = r.user_id
                  LEFT JOIN employees e on e.employee_id = ${employees[0].employee_id}
                  LEFT JOIN users eu on eu.user_id = e.employee_id
                  LEFT JOIN rooms ro on ro.room_id = r.room_id
                  WHERE ro.hotel_id = e.hotel_id
                  GROUP BY l.lease_id, r.reservation_id, u.name, u.user_id, ro.room_id, eu.name, eu.user_id, eu.address, eu.phone_number, eu.email
              `;

        if (reservations != null) {
          res.status(200).json(reservations);
        } else {
          res.status(401);
        }
      } else {
        res.status(422).json({ error: 'missing Employee ID session' });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json({ error: true });
}
