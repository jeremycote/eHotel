import HotelGrid from '../components/hotel-grid/hotel-grid';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <div className={styles.content}>
        <HotelGrid />
      </div>
    </>
  );
}
