export function getHomeRoute() {
  return '/';
}

export function getHotelRoute(hotelId: number | string) {
  return `/hotel/${hotelId}`;
}

export function getBookHotelRoute(hotelId: number | string) {
  return `/book/${hotelId}`;
}
