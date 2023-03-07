import '@/src/styles/colours.css';
import '@/src/styles/globals.css';
import '@/src/styles/grids.css';
import '@/src/styles/utils.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import NavBar from '../components/navbar/navbar';

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const navbarHeight = '3em';

  return (
    <>
      <Head>
        <title>eHotel</title>
        <meta name='description' content='Hotel bookings for CSI2532' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='main'>
        <NavBar height={navbarHeight} />
        <div style={{ marginTop: navbarHeight }}>
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
}
