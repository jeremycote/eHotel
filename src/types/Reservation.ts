import Client from '@/src/types/Client';
import Room from '@/src/types/Room';
export default interface Reservation {
  reservation_id: number;
  client: Client[];
  room: Room[];
  price: number;
  archived: boolean;
  number_guests: number;
}
