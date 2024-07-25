import { useAppDispatch, useAppSelector } from '../store/hooks';
import CartItem from '../components/cart/CartItem';
import Checkout from '../components/cart/Checkout';
import { useEffect } from 'react';
import { setInitialCart } from '../store/cartSlice';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { CartItem as CartItemType } from '../types/CartItem';
// import { db } from '../firebaseInit';
// import { disableLoader, enableLoader } from '../store/authSlice';
// import { useAuthContext } from "../hooks/useAuthContext";
// import { useCartContext } from '../hooks/useCartContext';

export default function Cart() {
  // const { cartItems, setCartItems } = useCartContext();
  // const { uid, setLoading, loading } = useAuthContext();
  const { uid, loading } = useAppSelector((state) => state.auth);
  const { cartItems, loader } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const isCartEmpty = cartItems.length === 0;
  const total = cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  // const getCartItems = async () => {
  //   try {
  //     // setLoading(true);
  //     dispatch(enableLoader());

  //     const q = query(collection(db, 'Cart'), where('uid', '==', uid));
  //     const querySnapshot = await getDocs(q);
  //     const list: CartItemType[] = [];
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       console.log(doc.id, ' => ', doc.data());
  //       const item = {
  //         cartId: doc.id,
  //         ...doc.data(),
  //       };
  //       list.push(item as CartItemType);
  //     });
  //     setCartItems(list);
  //   } catch (error) {
  //     console.log('error in fetching orders', error);
  //   } finally {
  //     // setLoading(false);
  //     dispatch(disableLoader());
  //   }
  // };

  useEffect(() => {
    // getCartItems();
    dispatch(setInitialCart(uid));
  }, []);

  return (
    <section className='py-24 relative'>
      <div className='w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto'>
        {!loading && !loader && (
          <h2 className='title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black'>
            Your Cart {isCartEmpty ? 'is empty' : ''}
          </h2>
        )}
        {!isCartEmpty && (
          <>
            {cartItems.map((item, index) => (
              <CartItem product={item} key={index} />
            ))}
            <Checkout total={total} />
          </>
        )}
      </div>
    </section>
  );
}
