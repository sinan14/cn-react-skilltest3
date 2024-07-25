import { ReactNode, useState } from 'react';
import { CartContext } from '../../context/cart.context';
import { CartItem } from '../../types/CartItem';
import { ProductItem } from '../../types/ProductItem';
import { Order } from '../../types/Order';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseInit';
// import { useAuthContext } from "../../hooks/useAuthContext";
import { successAlert } from '../../utils/Alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { disableLoader, enableLoader } from '../../store/authSlice';

type CartContextPropType = {
  children: ReactNode;
};

/**
 * function to keep code clean
 * manages cart and orders related state and db operation to above Cart and Orders
 */
export default function CartContextProvider({ children }: CartContextPropType) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // const { setLoading, uid, loggedIn } = useAuthContext();
  const { loggedIn, uid } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  /**
   * method to add to cart functionality
   * adding to cart for logged in user only
   */
  const onAddCart = async (product: ProductItem) => {
    try {
      if (!loggedIn) return;
      //setLoading(true);
      dispatch(enableLoader());
      const index = cartItems.findIndex((item) => item.id == product.id);
      if (index == -1) {
        const item = { ...product, quantity: 1, uid: uid };
        const doc = await addDoc(collection(db, 'Cart'), item);
        setCartItems((prev) => [...prev, { ...item, cartId: doc.id }]);
      } else {
        const cartItem = cartItems[index];
        const quantity = cartItem.quantity + 1;
        await updateDoc(doc(db, 'Cart', cartItem.cartId), {
          quantity,
        });
        cartItem.quantity = quantity;
        setCartItems((prev) => [
          ...prev.slice(0, index),
          cartItem,
          ...prev.slice(index + 1),
        ]);
      }
      successAlert(
        index === -1 ? 'Successfully added' : 'Increasesd product count'
      );
    } catch (error) {
      console.log('error in onAddCart ', error);
    } finally {
      //setLoading(false);
      dispatch(disableLoader());
    }
  };
  /**
   * remove whole cart product data from db and state
   */
  const removeItem = async (cartItem: CartItem) => {
    try {
      if (!loggedIn) return;
      //setLoading(true);
      dispatch(enableLoader());
      await deleteDoc(doc(db, 'Cart', cartItem.cartId));
      setCartItems(cartItems.filter((item) => item.id != cartItem.id));
      successAlert('removed from cart');
    } catch (error) {
      console.log('error in remove ==>', error);
    } finally {
      //setLoading(false);
      dispatch(disableLoader());
    }
  };
  /**
   * decreases quantity of product in quantity from cart
   * removes whole product if quantity is just 1
   */
  const removeOneItem = async (product: CartItem) => {
    try {
      if (!loggedIn) return;
      //setLoading(true);
      dispatch(enableLoader());
      const index = cartItems.findIndex((item) => item.id == product.id);
      if (index === -1) return;
      const cartItem = cartItems[index];
      const { quantity } = cartItem;
      if (quantity == 1) {
        removeItem(product);
      } else {
        cartItem.quantity = quantity - 1;
        await updateDoc(doc(db, 'Cart', cartItem.cartId), {
          quantity: cartItem.quantity,
        });
        setCartItems((prev) => [
          ...prev.slice(0, index),
          cartItem,
          ...prev.slice(index + 1),
        ]);
      }
      //setLoading(false);
      dispatch(disableLoader());
    } catch (error) {
      console.log('error in remove oneItem ==>', error);
      //setLoading(false);
      dispatch(disableLoader());
    }
  };

  /**
   * checkout functionality store the cart items in db and clears db
   * adds user uid to document to fetch orders based on user
   */
  const clearCart = async () => {
    try {
      const temp = [...cartItems];
      setCartItems([]);
      //setLoading(true);
      dispatch(enableLoader());
      for (const { cartId } of temp) {
        await deleteDoc(doc(db, 'Cart', cartId));
      }
    } catch (error) {
      console.log('error in clearing ', error);
    } finally {
      //setLoading(false);
      dispatch(disableLoader());
    }
  };

  const checkOut = async () => {
    try {
      if (!loggedIn) return;
      //setLoading(true);
      dispatch(enableLoader());
      let orderTotal = 0;
      const orderItems = cartItems.map((item) => {
        const total = item.price * item.quantity;
        orderTotal += total;
        return {
          ...item,
          total,
        };
      });
      const order = {
        items: orderItems,
        total: orderTotal,
        date: new Date(),
        uid,
      };
      const doc = await addDoc(collection(db, 'Orders'), order);
      setOrders([...orders, { ...order, orderId: doc.id }]);
      successAlert('Your orders added successfully');
      clearCart();
    } catch (error) {
      console.log('error in checkout ', error);
    } finally {
      //setLoading(false);
      dispatch(disableLoader());
    }
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        onAddCart,
        removeItem,
        removeOneItem,
        orders,
        checkOut,
        setOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
