export interface Hotel {
  hotel_id: number;
  chain_id: number;
  name: string;
  stars: number;
  address: string;
  zone: string;
  images?: string[];
  emails?: string[];
  phone_numbers?: string[];
}
