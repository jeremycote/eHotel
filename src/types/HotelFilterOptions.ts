import { Category } from './Category';
import HotelChain from './HotelChain';
import Zone from './Zone';

export default interface HotelFilterOptions {
  zones: Zone[];
  max_capacity: number;
  max_area: number;
  chains: HotelChain[];
  categories: Category[];
  max_size: number;
  max_price: number;
}
