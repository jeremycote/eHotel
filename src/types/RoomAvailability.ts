export interface RoomAvailability {
  hotel_id: number;
  room_type_id: number;
  room_type_name: string;
  count: number;
  lowest_price: number;
}

export default RoomAvailability;
