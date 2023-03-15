import { Hotel } from '@/src/types/Hotel';
import HotelFilter, { hotelFilterToString } from '@/src/types/HotelFilter';
import { useEffect, useState } from 'react';
import ResultFilter from '../result-filter/result-filter';
import HotelCard from '../hotel-card/hotel-card';

const HotelGrid = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [filter, setFilter] = useState<HotelFilter | null>(null);

  const onFilterChange = (f: HotelFilter) => {
    setFilter(f);
  };

  useEffect(() => {
    setLoading(true);
    fetch(
      `api/get-hotels?getImages=true${
        filter != null ? '&' + hotelFilterToString(filter) : ''
      }`,
    )
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  }, [filter]);

  if (isLoading) return <p>Loading...</p>;
  if (!hotels.length) return <p>No hotels found</p>;

  return (
    <div>
      <div>
        <ResultFilter
          height='5em'
          itemWidth={6}
          itemSpacing={0.5}
          onFilterChange={onFilterChange}
        />
      </div>

      <div className='results-grid'>
        {hotels.map((hotel) => (
          <HotelCard className='result' hotel={hotel} key={hotel.hotel_id} />
        ))}
      </div>
    </div>
  );
};

export default HotelGrid;
