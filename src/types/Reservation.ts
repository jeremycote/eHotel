import { Room } from '@/src/types/Room';
import User from './User';
export default interface Reservation {
  reservation_id: number;
  start_date: string;
  end_date: string;
  client: User;
  room: Room;
  price: number;
  archived: boolean;
  number_guests: number;
}

export interface FullReservationDetails {
  reservation_id: number;
  hotel_name: string;
  room_type: string;
  price: number;
  number_guests: number;
  start_date: string;
  end_date?: string;
}
