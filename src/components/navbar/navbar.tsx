import { getHomeRoute } from '@/src/config/routes';
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
    <nav className={styles.navbar} style={{ height: height }}>
      <ul>
        <li
          onClick={(e) => {
            e.preventDefault();
            router.push(getHomeRoute());
          }}
        >
          Home
        </li>
        <li>Signed in as {session?.user?.name ?? 'NULL'}</li>
        <SearchBar />
      </ul>
    </nav>
  );
};

export default NavBar;
