import Reservation from '@/src/types/Reservation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DashboardStatCell from '../components/dashboard-stat-cell/dashboard-stat-cell';
import { getEmployeeDashboardStatsRoute } from '../config/routes';
import useRoles from '../hooks/use-roles';
import useUser from '../hooks/use-user';
import { AsyncStateStates } from '../types/AsyncState';
import EmployeeDashboardStats from '../types/EmployeeDashboardStats';
import UserRole from '../types/UserRole';

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

  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [isLoadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    setLoadingStats(true);
    fetch(getEmployeeDashboardStatsRoute())
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      });
  }, [user]);

  return (
    <div>
      {user.status === AsyncStateStates.Success && (
        <>
          <div className='w-100 grid h-64 grid-cols-6 gap-4 m-8'>
            <DashboardStatCell
              isLoading={isLoading}
              label={'Handeld Leases'}
              value={stats?.leases ?? 0}
            />
            <DashboardStatCell
              isLoading={isLoading}
              label={'Pending Reservations'}
              value={stats?.reservations ?? 0}
            />
          </div>

          <h1>{`Employee id: ${user.data.name}`}</h1>
          <p>{JSON.stringify(reservations)}</p>
        </>
      )}
    </div>
  );
}
