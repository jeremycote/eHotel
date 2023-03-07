import SwiperCore, {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './image-carousel.module.css';

interface ImageCarouselProps {
  height?: string;
  width?: string;
  slidesPerView?: number;
  images: string[];
  isLoading: boolean;
}

/**
 * Please see https://swiperjs.com/demos
 * @returns
 */
const ImageCarousel = ({
  height = '16em',
  width = '16em',
  slidesPerView = 1,
  images,
  isLoading,
}: ImageCarouselProps) => {
  SwiperCore.use([EffectCoverflow, Pagination]);

  return (
    //   {isLoading && <img src='/vercel.svg' />}
    <div className={styles.imageCarousel} style={{ height, width }}>
      {!isLoading && (
        <Swiper
          modules={[Autoplay, Navigation]}
          effect={'coverflow'}
          grabCursor={true}
          slidesPerView={slidesPerView}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
        >
          {images.map((image, i) => (
            <SwiperSlide key={i}>
              <div className={styles.carouselSlide} style={{ height }}>
                <img src={image} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ImageCarousel;
