export default interface Lease {
  lease_id: number;
  reservation_id: number;
  employee_id: number;
  paid: boolean;
  archived: boolean;
}
