import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  getLoginRoute,
} from '@/src/config/routes';
import { useEffect, useState } from 'react';
import { FullRoomData } from '@/src/types/Room';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import {toast, ToastContainer} from "react-toastify";

interface BookingFormData {
  numberGuests: number;
}

export default function ClientDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<FullRoomData | null>(null);
  const { roomId, startDate, endDate } = router.query;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>();
  const onSubmit = handleSubmit((data) => {
    fetch(`/api/book/confirm/`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify({
        roomId,
        numberGuests: data.numberGuests,
        startDate,
        endDate,
        fullPrice: room?.full_price,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          router.push('/');
          toast.success("The reservation has been successfully created! Thank you for booking with us!")
        } else {
          toast.error("An error occurred while creating the reservation. Please try again later...")
        }
      });
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(getLoginRoute(`/book/confirm/${roomId}`));
    }
  }, []);

  useEffect(() => {
    if (roomId && startDate && endDate) {
      setLoading(true);
      fetch(
        `/api/get-room/${roomId}?startDate=${startDate}&endDate=${endDate}&available=true`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length) {
            setRoom(data[0]);
          }
          setLoading(false);
        });
    }
  }, [roomId]);

  const numberOfDays = Math.round(
    dayjs(String(endDate)).diff(String(startDate), 'days'),
  );

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className='py-3 px-3 lg:px-[20%]'>
      <div className='pb-3'>
        <div className='md:flex md:items-center'>
          <h1 className='text-4xl font-bold'>{room?.hotel_name}</h1>
          <span className='text-base ml-0 md:ml-2'>
            {[...Array(room?.hotel_stars)].map((i) => (
              <FontAwesomeIcon key={i} icon={faStar} />
            ))}
          </span>
        </div>
        <p className='text-base'>{room?.hotel_address}</p>
      </div>
      <div className='p-4 rounded-lg border grid lg:grid-cols-2'>
        <div>
          <h3 className='text-xl font-bold'>
            Room: {room?.room_type} (${room?.price}/night)
          </h3>
          <h4 className='text-md'>Max Capacity: {room?.capacity}</h4>
          <h4 className='text-md'>
            Expandable: {room?.extendable ? 'Yes' : 'No'}
          </h4>
          <h4 className='text-md'>View: {room?.view}</h4>
          <h4 className='text-md'>Amenities:</h4>
          {room?.room_amenities.length ? (
            <ul className='list-disc pl-4'>
              {room.room_amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <div>The list of amentities is unavailable.</div>
          )}
        </div>
        <div className='flex flex-col items-end justify-end pt-3 lg:pt-0'>
          <p className='text-md'>
            {startDate} to {endDate}
          </p>
          <p className='text-md'>({numberOfDays} Nights)</p>
          <p className='text-lg'>Total: ${room?.full_price}</p>
        </div>
      </div>
      <div className='mt-2 rounded-lg'>
        <form onSubmit={onSubmit}>
          <div className='flex justify-between w-full items-center'>
            <div className='flex'>
              <label
                className='bg-slate-50 text-gray-700 flex p-2 h-10 rounded-l-lg'
                htmlFor='guest_numbers'
              >
                Number of guests
              </label>
              <input
                {...register('numberGuests')}
                id='guest_numbers'
                type='number'
                min='1'
                max={room?.capacity}
                className='border border-slate-50 rounded-r-lg pl-4 h-10'
                required
              />

              {errors.numberGuests && (
                <p role='alert'>{errors.numberGuests?.message}</p>
              )}
            </div>
            <div>
              <button
                type='submit'
                className='text-gray-700 bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
              >
                Book for ${room?.full_price}
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
