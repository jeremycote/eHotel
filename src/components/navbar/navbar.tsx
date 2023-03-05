import SearchBar from '../searchbar/searchbar';
import styles from './navbar.module.css';

interface NavbarProps {
  height: string;
}

const NavBar = ({ height }: NavbarProps) => {
  return (
    <nav className={styles.navbar} style={{ height: height }}>
      <ul>
        <li>Home</li>
        <li>Other</li>
        <SearchBar />
      </ul>
    </nav>
  );
};

export default NavBar;
