/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';
import { CartItem } from '../types/CartItem';
import { Order } from '../types/Order';
import { ProductItem } from '../types/ProductItem';
/**
 * context to manage cart state and orders state
 */
export const CartContext = createContext({
  cartItems: [] as CartItem[],
  orders: [] as Order[],
  setCartItems: (value: CartItem[]) => {},
  onAddCart: (value: ProductItem) => {},
  removeItem: (value: CartItem) => {},
  removeOneItem: (value: CartItem) => {},
  checkOut: () => {},
  setOrders: (orders: Order[]) => {},
});
