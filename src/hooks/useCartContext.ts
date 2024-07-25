import { useContext } from "react";
import { CartContext } from "../context/cart.context";
/**
 * custom hook to use cart context value
 */
export function useCartContext() {
  return useContext(CartContext);
}
