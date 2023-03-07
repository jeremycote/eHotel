import ImageCarousel from '@/src/components/image-carousel/image-carousel';
import { Hotel } from '@/src/types/Hotel';
import { Room } from '@/src/types/Room';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HotelPage() {
  const router = useRouter();
  const { hotelId } = router.query;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (hotelId != null) {
      setLoading(true);
      fetch(`/api/get-hotel/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setHotel(data);
          setLoading(false);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId != null) {
      setLoadingRooms(true);
      fetch(`/api/get-rooms/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          setLoadingRooms(false);
        });
    }
  }, [hotelId]);

  return (
    <div>
      <h1>{`Hotel id: ${hotel != null ? hotel.name : 'null'}`}</h1>
      <ImageCarousel
        height='24em'
        width='48em'
        images={hotel?.images ?? []}
        isLoading={isLoading}
      />
      {!isLoadingRooms &&
        rooms.map((room, i) => (
          <div>
            <p>{room.room_id}</p>
          </div>
        ))}
    </div>
  );
}
