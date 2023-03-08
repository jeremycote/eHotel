import ImageCarousel from '@/src/components/image-carousel/image-carousel';
import { getBookHotelRoute } from '@/src/config/routes';
import { Hotel } from '@/src/types/Hotel';
import RoomAvailability from '@/src/types/RoomAvailability';
import { RoomType } from '@/src/types/RoomType';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HotelPage() {
  const router = useRouter();

  const { hotelId } = router.query;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoadingRoomTypes, setLoadingRoomTypes] = useState(false);

  const [roomAvailabilities, setRoomAvailabilities] = useState<
    RoomAvailability[]
  >([]);
  const [isLoadingRoomAvailabilities, setLoadingRoomAvailabilties] =
    useState(false);

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
      setLoadingRoomAvailabilties(true);
      fetch(
        `/api/get-room-availability/${hotelId}?startDate=2023-02-02&endDate=2023-06-01&available=false`,
      )
        .then((res) => res.json())
        .then((data) => {
          setRoomAvailabilities(data);
          setLoadingRoomAvailabilties(false);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    setLoadingRoomTypes(true);
    fetch('/api/get-room-types')
      .then((res) => res.json())
      .then((data) => {
        setRoomTypes(data);
        setLoadingRoomTypes(false);
      });
  }, []);

  return (
    <div>
      <h1>{`Hotel id: ${hotel != null ? hotel.name : 'null'}`}</h1>
      <ImageCarousel
        height='24em'
        width='48em'
        images={hotel?.images ?? []}
        isLoading={isLoading}
      />

      <table>
        <thead>
          <tr>
            <th>room type</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>
          {!isLoadingRoomAvailabilities &&
            roomAvailabilities.map((availabiltity, i) => (
              <tr>
                <td>
                  {roomTypes.length > availabiltity.room_type_id + 1
                    ? roomTypes[availabiltity.room_type_id].name
                    : 'loading'}
                </td>
                <td>{availabiltity.count}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        className='cta-button'
        onClick={(e) => {
          e.preventDefault();
          router.push(getBookHotelRoute(`${hotelId}`));
        }}
      >
        Book
      </button>
    </div>
  );
}
