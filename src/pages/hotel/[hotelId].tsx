import ImageCarousel from '@/src/components/image-carousel/image-carousel';
import { getBookHotelRoute } from '@/src/config/routes';
import { Hotel } from '@/src/types/Hotel';
import RoomAvailability from '@/src/types/RoomAvailability';
import { RoomType } from '@/src/types/RoomType';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import { calcEndDate } from '@/src/utils/date-utils';
import { HotelRoomCapacity } from '@/src/types/HotelRoomCapacity';
import {addDays} from "date-fns";
import dayjs from "dayjs";

export default function HotelPage() {
  const router = useRouter();

  const { hotelId } = router.query;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const [roomAvailabilities, setRoomAvailabilities] = useState<
    RoomAvailability[]
  >([]);
  const [isLoadingRoomAvailabilities, setLoadingRoomAvailabilties] =
    useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [roomCapacities, setRoomCapacities] = useState<HotelRoomCapacity[]>([]);
  const [isLoadingRoomCapacities, setLoadingRoomCapacities] = useState(false);

  useEffect(() => {
    if (hotelId != null) {
      setLoading(true);
      fetch(`/api/get-hotel/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setHotel(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId != null && startDate != null && endDate != null) {
      setLoadingRoomAvailabilties(true);
      fetch(
        `/api/get-room-availability/${hotelId}?startDate=${startDate.toDateString()}&endDate=${endDate.toDateString()}&available=true`,
      )
        .then((res) => res.json())
        .then((data) => {
          setRoomAvailabilities(data);
          setLoadingRoomAvailabilties(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [hotelId, startDate, endDate]);

  useEffect(() => {
    if (hotelId != null) {
      setLoadingRoomCapacities(true);
      fetch(`/api/hotel-capacity/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setRoomCapacities(data);
          setLoadingRoomCapacities(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [hotelId]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/get-room-types')
      .then((res) => res.json())
      .then((data) => {
        setRoomTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return isLoading || !hotel ? (
    <div>Loading...</div>
  ) : (
    <div className='p-3'>
      <div className='md:flex md:items-center pb-3'>
        <h1 className='text-2xl font-bold'>{hotel.name}</h1>
        <span className='text-base ml-0 md:ml-2'>
          {[...Array(hotel.stars)].map((i) => (
            <FontAwesomeIcon key={i} icon={faStar} />
          ))}
        </span>
      </div>
      <div className='block'>
        <ImageCarousel
          height='auto'
          width='auto'
          images={hotel?.images ?? []}
          isLoading={isLoading}
        />
      </div>

      {!isLoading && (
        <div className='px-5'>
          <h2 className='text-xl font-semibold mb-2'>
            Available Room Types for selected dates
          </h2>
          <DatePicker
            className='border px-2 my-2 h-8 text-sm rounded-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              if (start && end && Math.round(dayjs(String(end)).diff(String(start), 'days')) === 0) {
                  setEndDate(addDays(start, 1))
              } else {
                  setEndDate(end)
              }
            }}
            selectsRange={true}
            placeholderText='Choose Dates'
            closeOnScroll
            minDate={new Date()}
            maxDate={calcEndDate(6)}
            // withPortal
          />
          {roomAvailabilities.length ? (
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Room Type
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Lowest Price
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Room Left
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Book
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roomAvailabilities.map((avail, i) => (
                    <tr
                      key={avail.room_type_id}
                      className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-white whitespace-nowrap'
                      >
                        {avail.room_type_name}
                      </th>
                      <td className='px-6 py-4 text-white'>
                        ${avail.lowest_price}/night
                      </td>
                      <td className='px-6 py-4 text-white'>{avail.count}</td>
                      <td className='px-6 py-4 text-white'>
                        <Link
                          href={getBookHotelRoute(
                            `${hotelId}`,
                            `${startDate?.toDateString()}`,
                            `${endDate?.toDateString()}`,
                            avail.room_type_id,
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
          ) : (
            <div
              className='flex p-4 my-2 mb-4 text-sm bg-gray-800 text-yellow-300 border-yellow-800 items-center rounded-lg'
              role='alert'
            >
              <FontAwesomeIcon
                className='mr-2'
                icon={faCircleExclamation}
                size='lg'
              />
              <span className='sr-only'>Warning</span>
              <div>
                <span className='font-medium'>Warning!</span>
                {startDate != null && endDate != null
                  ? ' No available Rooms for these dates... Please try other dates or another hotel'
                  : ' Please choose dates.'}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && (
        <div className='px-5 pt-10'>
          <h1 className='text-2xl font-semibold mb-2'>Hotel Details</h1>
          <h2 className='text-xl font-semibold mb-2'>Room Capacities</h2>

          {roomCapacities.length ? (
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Room Type
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Capacity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roomCapacities.map((capacity, i) => (
                    <tr
                      key={capacity.room_id}
                      className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-white whitespace-nowrap'
                      >
                        {capacity.type}
                      </th>
                      <td className='px-6 py-4 text-white'>
                        {capacity.capacity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className='flex p-4 my-2 mb-4 text-sm bg-gray-800 text-yellow-300 border-yellow-800 items-center rounded-lg'
              role='alert'
            >
              <FontAwesomeIcon
                className='mr-2'
                icon={faCircleExclamation}
                size='lg'
              />
              <span className='sr-only'>Warning</span>
              <div>
                <span className='font-medium'>Warning!</span>
                {' No Rooms Found...'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
