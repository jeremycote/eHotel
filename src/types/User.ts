export default interface User {
  id: number;
  address: string;
  name: string;
  email: string;
  is_employee: boolean;
  created_at: string;
  nas: string;
  phone_number?: string;
}
