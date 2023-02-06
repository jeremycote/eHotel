import styles from "./navbar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <a>Home</a>
      <a>Other</a>
    </nav>
  );
};

export default NavBar;
