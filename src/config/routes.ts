export function getHomeRoute() {
  return '/';
}

export function getHotelRoute(hotelId: number | string) {
  return `/hotel/${hotelId}`;
}

export function getBookHotelRoute(hotelId: number | string) {
  return `/book/${hotelId}`;
}

export function getLoginRoute() {
  return '/api/auth/signin';
}

export function getClientDashboardRoute() {
  return '/client-dashboard';
}
