import { getHotelFilterOptionsRoute } from '@/src/config/routes';
import useContainerDimensions from '@/src/hooks/use-container-dimensions';
import { Category } from '@/src/types/Category';
import HotelChain from '@/src/types/HotelChain';
import HotelFilter, { HotelFilterAttribute } from '@/src/types/HotelFilter';
import HotelFilterOptions from '@/src/types/HotelFilterOptions';
import Zone from '@/src/types/Zone';
import { ReactElement, useEffect, useRef, useState } from 'react';
import ResultFilterSelect from './result-filter-select';
import styles from './result-filter.module.css';
import DatePicker from 'react-datepicker';
import { calcEndDate } from '@/src/utils/date-utils';

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

  const [capacityOptions, setCapacityOptions] = useState<number[]>([]);
  const [zoneOptions, setZoneOptions] = useState<Zone[]>([]);
  const [areaOptions, setAreaOptions] = useState<number[]>([]);
  const [chainOptions, setChainOptions] = useState<HotelChain[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [sizeOptions, setSizeOptions] = useState<number[]>([]);

  const [filterDirty, setFilterDirty] = useState(false);

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    filter.startDate = start;
    filter.endDate = end;
    setFilter(filter);
    setFilterDirty(true);
  };

  const createNumberOptions = (n: number, increment: number, start: number) => {
    let options = [];

    for (let i = start; i <= n; i += increment) {
      options.push(i);
    }

    return options;
  };

  useEffect(() => {
    fetch(getHotelFilterOptionsRoute())
      .then((res) => res.json())
      .then((data: HotelFilterOptions) => {
        setCapacityOptions(createNumberOptions(data.max_capacity, 1, 1));
        setZoneOptions(data.zones);
        setAreaOptions(createNumberOptions(data.max_area, 10, 10));
        setChainOptions(data.chains);
        setCategoryOptions(data.categories);
        setSizeOptions(createNumberOptions(data.max_size, 1, 1));
        setFilterDirty(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChangeStringFilterOption = (
    attribute: HotelFilterAttribute,
    value: string,
  ) => {
    const f = filter as any;
    f[attribute] = value === 'Any' ? undefined : value;
    setFilter(f);
  };

  const onChangeNumberFilterOption = (
    attribute: HotelFilterAttribute,
    value: string,
  ) => {
    const f = filter as any;
    f[attribute] = value === 'Any' ? undefined : Number.parseInt(value);
    setFilter(f);
  };

  const [filters, setFilters] = useState<ReactElement[]>([]);

  useEffect(() => {
    setFilters([
      <ResultFilterSelect
        key='zoneFilter'
        minWidth={`${itemWidth}em`}
        label={'Zone: '}
        onChange={(e) => {
          onChangeStringFilterOption('zone', e.currentTarget.value);
        }}
        options={zoneOptions.map((zone, i) => (
          <option key={zone.name} value={zone.name}>
            {zone.name}
          </option>
        ))}
      />,
      <ResultFilterSelect
        key='capacityFilter'
        minWidth={`${itemWidth}em`}
        label={'Min Capacity: '}
        onChange={(e) => {
          onChangeNumberFilterOption('capacity', e.currentTarget.value);
        }}
        options={capacityOptions.map((v, i) => (
          <option key={`${i}capacity`} value={v}>
            {v}
          </option>
        ))}
      />,
      <ResultFilterSelect
        key='areaFilter'
        minWidth={`${itemWidth}em`}
        label={'Min Area: '}
        onChange={(e) => {
          onChangeNumberFilterOption('area', e.currentTarget.value);
        }}
        options={areaOptions.map((v, i) => (
          <option key={`${v}area`} value={v}>
            {v}m^2
          </option>
        ))}
      />,
      <ResultFilterSelect
        key='chainFilter'
        minWidth={`${itemWidth}em`}
        label={'Chain: '}
        onChange={(e) => {
          onChangeNumberFilterOption('chain', e.currentTarget.value);
        }}
        options={chainOptions.map((v, i) => (
          <option key={`${v.chain_id}chain`} value={v.chain_id}>
            {v.name}
          </option>
        ))}
      />,
      <ResultFilterSelect
        key='categoryFilter'
        minWidth={`${itemWidth}em`}
        label={'Category: '}
        onChange={(e) => {
          onChangeNumberFilterOption('category', e.currentTarget.value);
        }}
        options={categoryOptions.map((v, i) => (
          <option key={`${i}category`} value={v.category_id}>
            {v.name}
          </option>
        ))}
      />,
      <ResultFilterSelect
        key='sizeFilter'
        minWidth={`${itemWidth}em`}
        label={'Min Size: '}
        onChange={(e) => {
          onChangeNumberFilterOption('size', e.currentTarget.value);
        }}
        options={sizeOptions.map((v, i) => (
          <option key={`${i}size`} value={v}>
            {v}
          </option>
        ))}
      />,
      <li style={{ width: itemWidth }} key={'dateFilter'}>
        <DatePicker
          className='border px-2 h-8 text-sm rounded-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
          selected={filter.startDate}
          startDate={filter.startDate}
          endDate={filter.endDate}
          onChange={onChange}
          isClearable
          selectsRange={true}
          placeholderText='Any Dates'
          closeOnScroll
          minDate={new Date()}
          maxDate={calcEndDate(6)}
          // withPortal
        />
      </li>,
    ]);
    setFilterDirty(false);
  }, [filterDirty]);

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
          <button className='border px-2 my-2 h-8 text-sm rounded-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
            Back
          </button>
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
          <button className='border px-2 my-2 h-8 text-sm rounded-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'>
            Next
          </button>
        </li>
      )}
    </ul>
  );
};

export default ResultFilter;
