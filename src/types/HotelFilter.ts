export default interface HotelFilter {
  zone?: string;
  capacity?: number;
  area?: number;
  chain?: number;
  category?: number;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
}

export function hotelFilterToString(filter: HotelFilter) {
  let s = '';
  if (filter.zone) {
    s += `zone=${filter.zone}&`;
  }
  if (filter.capacity) {
    s += `capacity=${filter.capacity}&`;
  }
  if (filter.area) {
    s += `area=${filter.area}&`;
  }
  if (filter.chain) {
    s += `chain=${filter.chain}&`;
  }
  if (filter.category) {
    s += `category=${filter.category}&`;
  }
  if (filter.size) {
    s += `size=${filter.size}&`;
  }
  if (filter.minPrice) {
    s += `minPrice=${filter.minPrice}&`;
  }
  if (filter.maxPrice) {
    s += `maxPrice=${filter.maxPrice}&`;
  }
  if (filter.startDate) {
    s += `startDate=${filter.startDate}&`;
  }
  if (filter.endDate) {
    s += `endDate=${filter.endDate}&`;
  }

  return s.slice(0, -1);
}
