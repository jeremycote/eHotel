import SearchBar from '../searchbar/searchbar';
import styles from './navbar.module.css';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>Home</li>
        <li>Other</li>
        <SearchBar />
      </ul>
    </nav>
  );
};

export default NavBar;
