import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import UserAccountForm from '../components/user-account-form/user-account-form';
import User from '../types/User';

export default function ClientDashboard() {
  // useEffect(() => {}, []);

  // const { data, status } = useSession();
  // const router = useRouter();

  // if (status === 'loading') {
  //   return <h1>Loading</h1>;
  // }

  // if (status === 'unauthenticated') {
  //   return <h1>Unauthenticated</h1>;
  // }

  return (
    <div className='pt-10'>
      <h1>Client Dashboard</h1>

      <UserAccountForm />
    </div>
  );
}
