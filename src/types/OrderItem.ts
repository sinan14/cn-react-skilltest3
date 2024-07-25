import { CartItem } from "./CartItem";

export interface OrderItem extends CartItem {
  price: number;
}
