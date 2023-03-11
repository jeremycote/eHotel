export function getHomeRoute() {
  return '/';
}

export function getHotelRoute(hotelId: number | string) {
  return `/hotel/${hotelId}`;
}

export function getBookHotelRoute(hotelId: number | string) {
  return `/book/${hotelId}`;
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
