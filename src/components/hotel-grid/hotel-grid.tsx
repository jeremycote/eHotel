import React, { useEffect, useState } from 'react';
import { Hotel } from '@/src/types/Hotel';
import HotelCard from '../hotel-card/hotel-card';
import { Category } from '@/src/types/Category';
import CategoryFilter from '../category-filter/category-filter';

const HotelGrid = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/get-hotels?getImages=true')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!hotels.length) return <p>No hotels found</p>;

  return (
    <div>
      <div>
        <CategoryFilter height='5em' itemWidth='6em' itemSpacing='1em' />
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
