import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import UserAccountForm from '../components/user-account-form/user-account-form';
import useUser from '../hooks/use-user';
import { FullReservationDetails } from '../types/Reservation';

export default function ClientDashboard() {
  // useEffect(() => {}, []);

  const { data, status } = useSession();
  // const router = useRouter();

  // if (status === 'loading') {
  //   return <h1>Loading</h1>;
  // }

  // if (status === 'unauthenticated') {
  //   return <h1>Unauthenticated</h1>;
  // }

  const [loadingReservations, setLoadingReservations] = useState(false);
  const [reservations, setReservations] = useState<FullReservationDetails[]>(
    [],
  );

  useEffect(() => {
    setLoadingReservations(true);
    fetch('/api/reservations?details=true')
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  return (
    <div className='flex justify-center flex-col'>
      <div className='pt-3 w-1/2'>
        <h1 className='text-3xl font-bold'>Client Dashboard</h1>

        <UserAccountForm />
      </div>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Hotel Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Room Type
              </th>
              <th scope='col' className='px-6 py-3'>
                Number of Guests
              </th>
              <th scope='col' className='px-6 py-3'>
                Price
              </th>
              <th scope='col' className='px-6 py-3'>
                Start Date
              </th>
              <th scope='col' className='px-6 py-3'>
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res, i) => (
              <tr
                key={res.reservation_id}
                className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
              >
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-white whitespace-nowrap'
                >
                  {res.hotel_name};
                </th>
                <td className='px-6 py-4 text-white'>{res.room_type}</td>
                <td className='px-6 py-4 text-white'>{res.number_guests}</td>
                <td className='px-6 py-4 text-white'>
                  {res.end_date
                    ? `$${
                        Math.round(
                          dayjs(res.end_date).diff(res.start_date, 'days'),
                        ) * res.price
                      } Total`
                    : `$${res.price}/night`}
                </td>
                <td className='px-6 py-4 text-white'>{res.start_date}</td>
                <td className='px-6 py-4 text-white'>{res.end_date ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
