import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getLoginRoute } from '../config/routes';

export default function ClientDashboard() {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <h1>Loading</h1>;
  }

  if (status === 'unauthenticated') {
    router.push(getLoginRoute());
  }

  return <h1>Client Dashboard</h1>;
}
