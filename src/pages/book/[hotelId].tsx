import ImageCarousel from '@/src/components/image-carousel/image-carousel';
import { Hotel } from '@/src/types/Hotel';
import RoomAvailability from '@/src/types/RoomAvailability';
import { RoomType } from '@/src/types/RoomType';
import { useRouter, withRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {Room} from "@/src/types/Room";


export default function BookingPage() {
  const router = useRouter();
  const [loadingRoomAvailabilties, setLoadingRoomAvailabilties] =
    useState(false);
  const [roomAvailabilities, setRoomAvailabilities] = useState<RoomAvailability[]>([]);
  const [loadingRooms, setLoadingRooms] =
      useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const { hotelId } = router.query;

  useEffect(() => {
    if (hotelId != null) {
      setLoadingRoomAvailabilties(true);
      fetch(
        `/api/get-room-availability/${hotelId}?startDate=2023-02-02&endDate=2023-06-01&available=true`,
      )
        .then((res) => res.json())
        .then((data) => {
          setRoomAvailabilities(data);
          setLoadingRoomAvailabilties(false);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    setLoadingRooms(true);
    fetch(`/api/get-rooms/${hotelId}?startDate=2023-02-02&endDate=2023-06-01&available=true`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          setLoadingRooms(false);
        });
  }, [hotelId]);

  return (
    <div className="mx-3">
      <h1 className="text-2xl">Booking</h1>

      <div>
        { roomAvailabilities.map((rt => (
            <div className="p-3 rounded border my-3" key={rt.room_type_id}>
              <h2 className="text-xl">{rt.room_type_name}</h2>
              <h3 className="text-lg">Lowest Price: ${rt.lowest_price}</h3>

              { JSON.stringify(rooms.filter(r => r.room_type_id === rt.room_type_id)) }
            </div>
        )))}
      </div>
    </div>
  );
}
