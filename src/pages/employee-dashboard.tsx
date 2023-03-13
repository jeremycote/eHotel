import Reservation from '@/src/types/Reservation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useRoles from '../hooks/use-roles';
import useUser from '../hooks/use-user';
import { AsyncStateStates } from '../types/AsyncState';
import UserRole from '../types/UserRole';
import Link from "next/link";

export default function EmployeeDashboard() {
  const router = useRouter();

  const roles = useRoles();

  if (
    roles.status === AsyncStateStates.Success &&
    !roles.data.includes(UserRole.Employee)
  ) {
    router.push('/');
  }

  const user = useUser();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/employees/get-hotel-reservations`)
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="p-3">
      <div className="my-3">
        <Link href="/admin/hotel_chains" className="rounded p-3 bg-gray-800 text-slate-50">
          Edit Hotel Chains
        </Link>
      </div>
      {user.status === AsyncStateStates.Success && (
        <>
          <h1>{`Employee id: ${user.data.name}`}</h1>
          <p>{JSON.stringify(reservations)}</p>
        </>
      )}
    </div>
  );
}
