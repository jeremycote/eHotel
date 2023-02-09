import styles from "./searchbar.module.css";

const SearchBar = () => {
  return (
    <div className={styles.searchbar}>
      <a>Anywhere</a>
      <a>Any week</a>
      <a>Add guests</a>
      <i>S</i>
    </div>
  );
};

export default SearchBar;
