import User from './User';

export default interface Client extends User {
  phone_number: string;
}
