import {
  getClientDashboardRoute,
  getEmployeeDashboardRoute,
  getHomeRoute,
} from '@/src/config/routes';
import useResizeObserver from '@/src/hooks/use-resize-observer';
import useRoles from '@/src/hooks/use-roles';
import UserRole from '@/src/types/UserRole';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import SearchBar from '../searchbar/searchbar';
import styles from './navbar.module.css';

interface NavbarProps {
  onHeightChange: (height: number) => void;
}

const NavBar = ({ onHeightChange }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const roles = useRoles();

  const onResize = useCallback((target: HTMLDivElement) => {
    onHeightChange(target.clientHeight);
  }, []);

  const ref = useResizeObserver(onResize);

  return (
    <nav className={styles.navbar} ref={ref}>
      <a
        onClick={(e) => {
          e.preventDefault();
          router.push(getHomeRoute());
        }}
      >
        Home
      </a>
      <span />
      <SearchBar defaultHeight={'3em'} />
      <span />
      {roles.status === 'success' && roles.data.includes(UserRole.Employee) && (
        <a
          onClick={(e) => {
            e.preventDefault();
            router.push(getEmployeeDashboardRoute());
          }}
        >
          Employee Dashboard
        </a>
      )}
      <a
        onClick={(e) => {
          e.preventDefault();
          router.push(getClientDashboardRoute());
        }}
      >
        {(session != null && `Signed in as ${session?.user?.name ?? 'NULL'}`) ||
          'Sign In'}
      </a>
    </nav>
  );
};

export default NavBar;
