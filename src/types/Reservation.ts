import { Room } from '@/src/types/Room';
import User from './User';
export default interface Reservation {
  reservation_id: number;
  start_date: string;
  end_date: string;
  client: User[];
  room: Room[];
  price: number;
  archived: boolean;
  number_guests: number;
}
