import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getUserRolesRoute } from '../config/routes';
import AsyncState, { AsyncStateStates } from '../types/AsyncState';
import UserRole from '../types/UserRole';

const useRoles = (): AsyncState<UserRole[]> => {
  const { data: session } = useSession();

  const [roles, setRoles] = useState<AsyncState<UserRole[]>>({
    status: AsyncStateStates.Idle,
  });

  useEffect(() => {
    setRoles({ status: AsyncStateStates.Loading });

    if (session?.user?.email === null || session?.user?.email === undefined) {
      setRoles({ status: AsyncStateStates.Error, error: 'Invalid email' });
      return;
    }

    fetch(getUserRolesRoute(session!.user!.email!))
      .then((res) => res.json())
      .then((data) => {
        setRoles({ status: AsyncStateStates.Success, data: data });
      })
      .catch((reason) =>
        setRoles({ status: AsyncStateStates.Error, error: reason }),
      );
  }, [session]);

  return roles;
};

export default useRoles;
