import styles from '@/src/styles/Home.module.css';
import Head from 'next/head';
import HotelGrid from '../components/hotel-grid/hotel-grid';
import NavBar from '../components/navbar/navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>eHotel</title>
        <meta name='description' content='Hotel bookings for CSI2532' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.content}>
          <HotelGrid />
        </div>
      </main>
    </>
  );
}
