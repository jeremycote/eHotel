import '@/src/styles/colours.css';
import '@/src/styles/globals.css';
import '@/src/styles/grids.css';
import '@/src/styles/utils.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '../components/navbar/navbar';
import {ToastContainer} from "react-toastify";

config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>eHotel</title>
        <meta name='description' content='Hotel bookings for CSI2532' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SessionProvider session={session}>
        <main className='main'>
          <NavBar />
          <div>
            <Component {...pageProps} />
            <ToastContainer />
          </div>
        </main>
      </SessionProvider>
    </>
  );
}
