import RoomAvailability from '@/src/types/RoomAvailability';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Room } from '@/src/types/Room';
import useCollapse from 'react-collapsed';
import { Hotel } from '@/src/types/Hotel';
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface RoomTypeCollapseProps {
  roomType: RoomAvailability;
  rooms: Room[];
}

export default function BookingPage() {
  const router = useRouter();
  const [loadingRoomAvailabilties, setLoadingRoomAvailabilties] =
    useState(false);
  const [roomAvailabilities, setRoomAvailabilities] = useState<
    RoomAvailability[]
  >([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);

  const { hotelId } = router.query;

  useEffect(() => {
    if (hotelId != null) {
      setLoadingHotel(true);
      fetch(`/api/get-hotel/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setHotel(data);
          setLoadingHotel(false);
        });
    }
  }, [hotelId]);

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
    fetch(
      `/api/get-rooms/${hotelId}?startDate=2023-02-02&endDate=2023-06-01&available=true`,
    )
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoadingRooms(false);
      });
  }, [hotelId]);

  const RoomTypeCollapse = ({ roomType, rooms }: RoomTypeCollapseProps) => {
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();

    return (
      <div>
        <button className="w-full" {...getToggleProps()}>
          <div className='p-3 rounded border my-3 flex items-center'>
            <div className="mr-5">
                <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown} />
            </div>
            <div className="text-left">
                <h2 className='text-xl'>{roomType.room_type_name}</h2>
                <h3 className='text-lg'>Lowest Price: ${roomType.lowest_price}</h3>
            </div>
          </div>
        </button>
        <section {...getCollapseProps()}>
          <table className="w-full text-left mx-3">
            <thead>
              <tr>
                <th>Price</th>
                <th>Capacity</th>
                <th>View</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.room_id}>
                  <td>${r.price}</td>
                  <td>{r.capacity} people</td>
                  <td>{r.view}</td>
                  <td>
                      <a href={`/book/confirm/${r.room_id}`}>Book</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  };

  return (
    <div className='mx-3'>
      <h1 className='text-2xl'>Booking</h1>
      <h1 className='text-xl'>{hotel?.name}</h1>

      <div>
        {roomAvailabilities.map((rt) => (
          <>
            <RoomTypeCollapse
              roomType={rt}
              rooms={rooms.filter((r) => r.room_type_id === rt.room_type_id)}
              key={rt.room_type_id}
            />
          </>
        ))}
      </div>
    </div>
  );
}
