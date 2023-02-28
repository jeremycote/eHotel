import { Hotel } from '@/src/types/hotel';
import { useRouter } from 'next/router';
import styles from './hotel-card.module.css';

interface HotelCardProps {
  className: string;
  hotel: Hotel;
}

const HotelCard = ({ className, hotel }: HotelCardProps) => {
  const router = useRouter();

  return (
    <div
      className={`${className} ${styles.hotelCard}`}
      onClick={(e) => {
        e.preventDefault();
        router.push(`/hotel/${hotel.id}`);
      }}
    >
      <div className={styles.imageCarousel}>
        <img src={hotel.photos[0]}></img>
      </div>
      <div className={styles.description}>
        <h1>{hotel.name}</h1>
        <p>{`${hotel.minPrice} per night`}</p>
      </div>
    </div>
  );
};

export default HotelCard;
