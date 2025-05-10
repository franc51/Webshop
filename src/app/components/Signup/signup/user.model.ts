export interface Address {
  county: string;
  city: string;
  street: string;
  zip: number;
}
export interface CreditCard {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
}
export interface UserModel {
  name: string;
  email: string;
  password: string;
  addresses: Address[];
  creditCards: CreditCard[];
  orderHistory: any; // until i declare product interface
  isAdmin: boolean;
}
