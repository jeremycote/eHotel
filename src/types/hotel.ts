export interface Hotel {
  id: number;
  chain_id: number;
  name: string;
  stars: number;
  address: string;
  zone: string;
  images?: string[];
}
