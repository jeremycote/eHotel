export default interface RoomAvailability {
  room_id: number;
  hotel_id: number;
  room_type_id: number;
  room_type_name: string;
  count: number;
  lowest_price: number;
}
