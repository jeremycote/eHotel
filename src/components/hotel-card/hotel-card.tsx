import { Hotel } from "@/src/types/hotel";
import styles from "./hotel-card.module.css";

interface HotelCardProps {
  className: string;
  hotel: Hotel;
}

const HotelCard = ({ className, hotel }: HotelCardProps) => {
  return (
    <div className={`${className} ${styles.hotelCard}`}>
      <div className={styles.imageCarousel}>
        <img src={hotel.photos[0]}></img>
      </div>
      <div className={styles.description}>
        <h1>{hotel.name}</h1>
      </div>
    </div>
  );
};

export default HotelCard;
