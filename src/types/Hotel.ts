export interface Hotel {
  hotel_id: number;
  chain_id: number;
  name: string;
  stars: number;
  zone: string;
  address: string;
  zone_id: number;
  images?: string[];
  emails?: string[];
  category_ids?: number[];
  phone_numbers?: string[];
  lowest_price: number;
}
