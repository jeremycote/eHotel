import useContainerDimensions from '@/src/hooks/use-container-dimensions';
import HotelFilter from '@/src/types/HotelFilter';
import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './result-filter.module.css';

interface ResultFilterProps {
  height: string; // css style
  itemWidth: number; // in em
  itemSpacing: number; // in em
  onFilterChange: (filter: HotelFilter) => void;
}

const ResultFilter = ({
  height,
  itemWidth,
  itemSpacing,
  onFilterChange,
}: ResultFilterProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [nFiltersOnScreen, setNFiltersOnScreen] = useState(0);

  const componentRef = useRef(null);

  const [filter, _setFilter] = useState<HotelFilter>({});

  const setFilter = (f: HotelFilter) => {
    _setFilter(f);
    onFilterChange(f);
  };

  const [filters, setFilters] = useState<ReactElement[]>([
    <li
      key={'hi'}
      onClick={(e) => {
        e.preventDefault();
        let f = filter;
        f.capacity = 8;
        setFilter(f);
      }}
    >
      <p>Capacity</p>
      <select name='Capacity'>
        {Array.from(Array(20).keys()).map((v, i) => (
          <option value={i}>i</option>
        ))}
      </select>
    </li>,
    <li key={'h'}>
      <img src='/favicon.ico' />
      <p>hi</p>
    </li>,
  ]);

  // Updates to reflect current filter dimensions
  const { width: actualWidth, height: actualHeight } =
    useContainerDimensions(componentRef);

  // Index that the user has currently paged to
  const [filterIndex, setFilterIndex] = useState(0);

  function paginate(i: number) {
    if (filterIndex + i <= 0) {
      setFilterIndex(0);
    } else if (filterIndex + i >= filters.length) {
      // Do nothing, we've reached the end
    } else {
      setFilterIndex(filterIndex + i);
    }
  }

  /**
   * Calculate the number of categories that can fit on screen
   */
  useEffect(() => {
    // Nothing to calculate if the container doesn't exist
    if (componentRef.current == null) {
      return;
    }

    // Get the font size, this will be used to convert ems into pixels for width calculations
    const fontSize = parseFloat(
      window
        .getComputedStyle(componentRef.current!)
        .getPropertyValue('font-size'),
    );

    // ~~(x) will floor x
    const n = ~~(actualWidth / ((itemWidth + itemSpacing) * fontSize));

    setNFiltersOnScreen(n);
  }, [actualWidth, itemWidth, itemSpacing, componentRef]);

  return (
    <ul
      className={styles.resultFilter}
      style={{ height: height }}
      ref={componentRef}
    >
      {filterIndex > 0 && (
        <li
          onClick={(e) => {
            e.preventDefault;
            paginate(-nFiltersOnScreen);
          }}
        >
          <i>Back</i>
        </li>
      )}

      {!isLoading &&
        filters.map(
          (filter, index) =>
            index >= filterIndex &&
            filterIndex + nFiltersOnScreen > index &&
            filter,
        )}
      {filterIndex + nFiltersOnScreen < filters.length && (
        <li
          onClick={(e) => {
            e.preventDefault;
            paginate(nFiltersOnScreen);
          }}
        >
          <i>Next</i>
        </li>
      )}
    </ul>
  );
};

export default ResultFilter;
