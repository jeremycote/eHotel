import { Hotel } from '@/src/types/hotel';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HotelPage() {
  const router = useRouter();
  const { hotelId } = router.query;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (hotelId != null) {
      setLoading(true);
      fetch(`/api/get-hotel/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          setHotel(data);
          setLoading(false);
        });
    }
  }, [hotelId]);

  return (
    <div>
      <h1>{`Hotel id: ${hotel != null ? hotel.name : 'null'}`}</h1>
    </div>
  );
}
