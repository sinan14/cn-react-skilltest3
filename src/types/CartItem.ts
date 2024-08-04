import { ProductItem } from "./ProductItem";

export interface CartItem extends ProductItem {
  quantity: number;
  cartId:string;
}
