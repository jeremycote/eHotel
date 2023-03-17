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
import Link from 'next/link';
import EmployeeDashboardReservationTable from "@/src/components/employee-dashboard/EmployeeDashboardReservationTable";

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
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);

  const refreshReservations = () => {
    setLoading(true);
    fetch(`/api/employees/get-hotel-reservations`)
        .then((res) => res.json())
        .then((data) => {
          setReservations(data);
          setLoading(false);
        });
  }

  const refreshStats = () => {
    setLoading(true);
    fetch(getEmployeeDashboardStatsRoute())
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
  }

  const refreshData = () => {
    refreshReservations();
    refreshStats();
  }

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <div className='p-3'>
      <div className='my-3 flex gap-2'>
        <Link
          href='/admin/hotel_chains'
          className='rounded p-3 bg-gray-800 text-slate-50'
        >
          Edit Hotel Chains
        </Link>
        <Link
          href='/admin/hotels'
          className='rounded p-3 bg-gray-800 text-slate-50'
        >
          Edit Hotels
        </Link>
      </div>
      {user.status === AsyncStateStates.Success && (
        <>
          <div className='flex items-center justify-center gap-5'>
            <DashboardStatCell
                isLoading={isLoading}
                label={'Pending Reservations'}
                value={stats?.reservations ?? 0}
            />
            <DashboardStatCell
                isLoading={isLoading}
                label={'Lease waiting for Payment'}
                value={stats?.unpaid_leases ?? 0}
            />
            <DashboardStatCell
              isLoading={isLoading}
              label={'Handled Leases'}
              value={stats?.paid_leases ?? 0}
            />
          </div>

          <h1>{`Employee id: ${user.data.name}`}</h1>
          <EmployeeDashboardReservationTable reservations={reservations} refreshTables={() => refreshData()} />
          <p>{JSON.stringify(reservations)}</p>
        </>
      )}
    </div>
  );
}
