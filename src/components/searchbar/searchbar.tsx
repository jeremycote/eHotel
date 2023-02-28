import styles from "./searchbar.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <div className={styles.searchbar}>
      <a>Anywhere</a>
      <a>Any week</a>
      <a>Add guests</a>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </div>
  );
};

export default SearchBar;
