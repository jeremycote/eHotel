import styles from "./navbar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>Home</li>
        <li>Other</li>
      </ul>
    </nav>
  );
};

export default NavBar;
