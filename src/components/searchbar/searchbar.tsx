import styles from './searchbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface SearchBarProps {
  defaultHeight: string;
}

const SearchBar = ({ defaultHeight }: SearchBarProps) => {
  const [expanded, setExpanded] = useState(false);

  const [currentStyles, setCurrentStyles] = useState(styles.collapsed);

  function toggleExpand() {
    const e = !expanded;

    if (e) {
      // expand
      setCurrentStyles(styles.expanded);
    } else {
      // collapse
      setCurrentStyles(styles.collapsed);
    }

    setExpanded(e);
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        toggleExpand();
      }}
      className={`${styles.searchbar} ${currentStyles}`}
      style={{ height: expanded ? '8em' : defaultHeight }}
    >
      <a>Anywhere</a>
      <a>Any week</a>
      <a>Any view</a>
      <a>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </a>
    </div>
  );
};

export default SearchBar;
