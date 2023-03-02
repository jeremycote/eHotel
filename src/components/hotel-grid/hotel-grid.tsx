import React, { useEffect, useState } from 'react';
import { Hotel } from '@/src/types/Hotel';
import HotelCard from '../hotel-card/hotel-card';

const HotelGrid = () => {
  const [hotels, setHotels] = useState<Hotel[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('api/get-hotels')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!hotels) return <p>No hotels found</p>;

  return (
    <div className='results-grid'>
      {hotels.map((hotel) => (
        <HotelCard className='result' hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelGrid;
