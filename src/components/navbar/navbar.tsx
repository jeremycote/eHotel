import {
  getClientDashboardRoute,
  getEmployeeDashboardRoute,
  getLoginRoute,
  getSignupRoute,
} from '@/src/config/routes';
import useResizeObserver from '@/src/hooks/use-resize-observer';
import useRoles from '@/src/hooks/use-roles';
import UserRole from '@/src/types/UserRole';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import SearchBar from '../searchbar/searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import useUser from '@/src/hooks/use-user';
import { AsyncStateStates } from '@/src/types/AsyncState';

const NavBar = () => {
  const router = useRouter();
  const [navHidden, setNavHidden] = useState(false);

  const roles = useRoles();
  const user = useUser();

  return (
    <nav className='flex items-center justify-between flex-wrap bg-white py-3 lg:px-12 shadow border-solid rounded-b-md'>
      <div
        className={`${
          navHidden ? '' : 'border-b-2 pb-5'
        } flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-gray-300 lg:pb-0`}
      >
        <div className='flex items-center flex-shrink-0 text-gray-800 mr-4'>
          <Link href={'/'} className='font-semibold text-xl'>
            eHotel
          </Link>
        </div>
        <div className='block lg:hidden'>
          <label
            onClick={() => setNavHidden(!navHidden)}
            className='flex items-center px-3 py-2 border-2 rounded text-gray-700 border-gray-700 hover:text-gray-700 hover:border-gray-700'
          >
            <FontAwesomeIcon icon={faBars} />
          </label>
        </div>
      </div>

      <div
        id='menu'
        className={`${
          navHidden ? 'hidden' : ''
        } lg:flex w-full flex-grow flex-col lg:flex-row lg:flex lg:items-center lg:justify-between lg:w-auto lg:px-3 px-8`}
      >
        <div className='text-gray-800 text-md'>
          <Link className='nav-link' href='/'>
            Home
          </Link>
        </div>
        {/* <div className='hidden lg:flex'>
          <SearchBar defaultHeight='2.5em' />
        </div> */}
        <div className='text-gray-800 text-md'>
          {roles.status === 'success' &&
            roles.data.includes(UserRole.Employee) && (
              <Link className='nav-link' href={getEmployeeDashboardRoute()}>
                Employee Dashboard
              </Link>
            )}

          {user.status === AsyncStateStates.Success ? (
            <>
              <Link className='nav-link' href={getClientDashboardRoute()}>
                {`Hello, ${user.data.name ?? 'NULL'}`}
              </Link>
              <button
                type='button'
                className='nav-link'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign-Out
              </button>
            </>
          ) : (
            <>
              <Link className='nav-link' href={getLoginRoute('/')}>
                Sign-In
              </Link>
              <Link className='nav-link' href={getSignupRoute()}>
                Sign-Up
              </Link>
            </>
          )}
        </div>
        <div className='lg:hidden flex'>
          <SearchBar defaultHeight='2.5em' />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
