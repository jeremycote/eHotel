import { Hotel } from '@/src/types/Hotel';
import HotelFilter, { hotelFilterToString } from '@/src/types/HotelFilter';
import { useEffect, useState } from 'react';
import ResultFilter from '../result-filter/result-filter';
import HotelCard from '../hotel-card/hotel-card';

const HotelGrid = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [filter, setFilter] = useState<HotelFilter | null>(null);

  const [filterDirty, setFilterDirty] = useState(false);

  const onFilterChange = (f: HotelFilter) => {
    setFilter(f);
    setFilterDirty(true);
  };

  useEffect(() => {
    setFilterDirty(false);
    setLoading(true);

    fetch(`api/get-hotels?getImages=true&${hotelFilterToString(filter)}`)
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  }, [filter, filterDirty]);

  return (
    <div>
      <div>
        <ResultFilter
          height='5em'
          itemWidth={10}
          itemSpacing={0.5}
          onFilterChange={onFilterChange}
        />
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div className='results-grid'>
          {hotels.map((hotel) => (
            <HotelCard
              className='result'
              hotel={hotel}
              key={`${hotel.hotel_id}hotel`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelGrid;
