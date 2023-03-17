import { User } from 'next-auth';
import Reservation from '@/src/types/Reservation';

export interface Lease {
  lease_id: number;
  reservation_id: number;
  employee_id: number;
  paid: boolean;
  archived: boolean;
}

export interface FullLease {
  lease_id: number;
  employee: User;
  paid: boolean;
  archived: boolean;
  reservation: Reservation;
}
