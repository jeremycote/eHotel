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

  const [user, setUser] = useState<User | null>(null);
  const [userDirty, setUserDirty] = useState(false);

  useEffect(() => {
    console.log('Getting user');
    setUserDirty(false);
    fetch('/api/auth/account')
      .then((res) => res.json())
      .then((data: User | any) => {
        if (data.error) {
          toast.error('Sorry... An error occurred, could not fetch account.');
        } else {
          toast.success('Fetched account!');
          setUser(data);
          console.log(data);
        }
      })
      .catch(() => {
        toast.error('Sorry... An error occurred, could not fetch account.');
      });
  }, [userDirty]);

  return (
    <div className='pt-10'>
      <h1>Client Dashboard</h1>

      {user != null && (
        <UserAccountForm
          user={user}
          onSubmit={() => {
            console.log('Submit');
            setUserDirty(true);
          }}
        />
      )}
    </div>
  );
}
