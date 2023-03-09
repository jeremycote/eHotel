import { getClientDashboardRoute, getHomeRoute } from '@/src/config/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SearchBar from '../searchbar/searchbar';
import styles from './navbar.module.css';

interface NavbarProps {
  height: string;
}

const NavBar = ({ height }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <a
        onClick={(e) => {
          e.preventDefault();
          router.push(getHomeRoute());
        }}
      >
        Home
      </a>
      <span />
      <SearchBar defaultHeight={height} />
      <span />
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
