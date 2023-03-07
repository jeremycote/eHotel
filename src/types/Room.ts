export interface Room {
  room_id: number;
  hotel_id: number;
  price: number;
  capacity: number;
  extendable: boolean;
  damages?: string;
  view: string;
  room_type_id: number;
}
