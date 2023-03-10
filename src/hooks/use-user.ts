import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getUserRoute } from '../config/routes';
import AsyncState, { AsyncStateStates } from '../types/AsyncState';
import User from '../types/User';

const useUser = (): AsyncState<User> => {
  const { data: session } = useSession();

  const [user, setUser] = useState<AsyncState<User>>({
    status: AsyncStateStates.Idle,
  });

  useEffect(() => {
    setUser({ status: AsyncStateStates.Loading });

    fetch(getUserRoute())
      .then((res) => res.json())
      .then((data) => {
        setUser({ status: AsyncStateStates.Success, data: data });
      })
      .catch((reason) =>
        setUser({ status: AsyncStateStates.Error, error: reason }),
      );
  }, [session]);

  return user;
};

export default useUser;
