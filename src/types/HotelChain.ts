export default interface HotelChain {
  chain_id: number;
  name: string;
  address: string;
}

export default interface FullHotelChain {
  chain_id: number;
  name: string;
  address: string;
  emails?: string[];
  phone_numbers?: string[];
}
