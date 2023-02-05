import styles from "./navbar.module.css";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <a>Home</a>
      <a>Other</a>
    </div>
  );
};

export default NavBar;
