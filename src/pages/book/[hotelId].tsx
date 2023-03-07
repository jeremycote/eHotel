import ImageCarousel from '@/src/components/image-carousel/image-carousel';
import { Hotel } from '@/src/types/Hotel';
import RoomAvailability from '@/src/types/RoomAvailability';
import { RoomType } from '@/src/types/RoomType';
import { useRouter, withRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookingPage() {
  const router = useRouter();

  const { hotelId } = router.query;

  return (
    <div>
      <h1>Booking</h1>
    </div>
  );
}
