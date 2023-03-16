export interface Room {
  room_id: number;
  hotel_id: number;
  price: number;
  capacity: number;
  extendable: boolean;
  damages?: string;
  view: string;
  room_type_id: number;
  amenities: number[];
}

export interface FullRoomData {
  room_id: number;
  hotel_name: string;
  hotel_address: string;
  hotel_stars: number;
  price: number;
  full_price: number;
  capacity: number;
  extendable: boolean;
  damages?: string;
  view: string;
  room_type: string;
  room_amenities: string[];
}
