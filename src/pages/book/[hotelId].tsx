import RoomAvailability from '@/src/types/RoomAvailability';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Room } from '@/src/types/Room';
import useCollapse from 'react-collapsed';
import { Hotel } from '@/src/types/Hotel';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getBookHotelRoomRoute, getBookHotelRoute } from '@/src/config/routes';
import Link from 'next/link';

interface RoomTypeCollapseProps {
  roomType: RoomAvailability;
  rooms: Room[];
  expanded?: boolean;
}

export default function BookingPage() {
  const router = useRouter();
  const [roomAvailabilities, setRoomAvailabilities] = useState<
    RoomAvailability[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);

  const { hotelId, startDate, endDate, expandedRoomType } = router.query;

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
    if (hotelId && startDate && endDate) {
      setLoading(true);
      fetch(
        `/api/get-room-availability/${hotelId}?startDate=${startDate}&endDate=${endDate}&available=true`,
      )
        .then((res) => res.json())
        .then((data) => {
          setRoomAvailabilities(data);
          setLoading(false);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId && startDate && endDate) {
      setLoading(true);
      fetch(
        `/api/get-rooms/${hotelId}?startDate=${startDate}&endDate=${endDate}&available=true`,
      )
        .then((res) => res.json())
        .then((data) => {
          setRooms(data);
          setLoading(false);
        });
    }
  }, [hotelId]);

  const RoomTypeCollapse = ({
    roomType,
    rooms,
    expanded,
  }: RoomTypeCollapseProps) => {
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
      defaultExpanded: expanded ?? false,
    });

    return (
      <div className='my-2'>
        <button className='w-full' {...getToggleProps()}>
          <div className='border rounded p-3 my-3 flex items-center'>
            <div className='mr-5'>
              <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown} />
            </div>
            <div className='text-left'>
              <h2 className='text-xl'>Room: {roomType.room_type_name}</h2>
              <h3 className='text-lg'>
                Lowest Price: ${roomType.lowest_price}/night
              </h3>
            </div>
          </div>
        </button>
        <section className='p-3' {...getCollapseProps()}>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Price/night
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Capacity
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    View
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Book
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr
                    key={r.room_id}
                    className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
                  >
                    <th
                      scope='row'
                      className='px-6 py-4 font-bold text-white whitespace-nowrap'
                    >
                      ${r.price}/night
                    </th>
                    <td className='px-6 py-4 text-white'>
                      {r.capacity} people
                    </td>
                    <td className='px-6 py-4 text-white'>{r.view}</td>
                    <td className='px-6 py-4 text-white'>
                      <Link
                        href={getBookHotelRoomRoute(
                          r.room_id,
                          String(startDate),
                          String(endDate),
                        )}
                        className='text-gray-700 bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none'
                      >
                        Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rooms.length && (
            <div>Sorry... All rooms of that type have been booked.</div>
          )}
        </section>
      </div>
    );
  };

  return loading || !hotel ? (
    <p>loading...</p>
  ) : (
    <div className='p-3'>
      <h1 className='text-2xl'>Booking for {hotel.name}</h1>
      <div>
        {roomAvailabilities.map((rt) => (
          <>
            <RoomTypeCollapse
              roomType={rt}
              rooms={rooms.filter((r) => r.room_type_id === rt.room_type_id)}
              key={rt.room_type_id}
              expanded={Number(expandedRoomType) === rt.room_type_id}
            />
          </>
        ))}
      </div>
    </div>
  );
}
