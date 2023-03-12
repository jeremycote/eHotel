export function getHomeRoute() {
  return '/';
}

export function getHotelRoute(hotelId: number | string) {
  return `/hotel/${hotelId}`;
}

export function getBookHotelRoute(
  hotelId: number | string,
  startDate: string,
  endDate: string,
) {
  return `/book/${hotelId}?startDate=${startDate}&endDate=${endDate}`;
}

export function getBookHotelRoomRoute(
  roomId: number | string,
  startDate: string,
  endDate: string,
) {
  return `/book/confirm/${roomId}?startDate=${startDate}&endDate=${endDate}`;
}

export function getPostBookRoute(
  roomId: number | string,
  startDate: string,
  endDate: string,
) {
  return `/api/book/confirm/${roomId}?startDate=${startDate}&endDate=${endDate}`;
}

export function getLoginRoute(callbackUrl?: string) {
  return `/api/auth/signin${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`;
}

export function getClientDashboardRoute() {
  return '/client-dashboard';
}

export function getUserRolesRoute(email: string) {
  return `/api/get-user-roles/${email}`;
}

export function getUserRoute() {
  return '/api/get-user';
}

export function getEmployeeDashboardRoute() {
  return '/employee-dashboard';
}
