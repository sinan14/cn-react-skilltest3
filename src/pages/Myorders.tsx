import { useEffect } from 'react';
import OrderItem from '../components/my-orders/OrderItem';
import { setInitialOrders } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../firebaseInit';
// import { useAuthContext } from "../hooks/useAuthContext";
// import { useCartContext } from '../hooks/useCartContext';
// import { Order } from '../types/Order';
// import { disableLoader, enableLoader } from '../store/authSlice';

export default function Myorders() {
  // const { setLoading, uid, loading } = useAuthContext();
  const { uid, loading } = useAppSelector((state) => state.auth);
  const { orders, loader } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  // const getOrders = async () => {
  //   try {
  //     // setLoading(true);
  //     dispatch(enableLoader());
  //     const q = query(collection(db, 'Orders'), where('uid', '==', uid));
  //     const querySnapshot = await getDocs(q);
  //     const list: Order[] = [];
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       const data = doc.data();
  //       const date = data.date.toDate();
  //       const item = {
  //         ...data,
  //         orderId: doc.id,
  //         date,
  //       };
  //       list.push(item as Order);
  //     });
  //     setOrders(list);
  //     console.log('order from db ', list);
  //   } catch (error) {
  //     console.log('error in fetching orders', error);
  //   } finally {
  //     // setLoading(false);
  //     dispatch(disableLoader());
  //   }
  // };

  useEffect(() => {
    // getOrders();
    dispatch(setInitialOrders(uid));
  }, []);

  return (
    <section className='py-24 relative'>
      <div className='w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto'>
        <h2 className='font-manrope font-bold text-4xl leading-10 text-black text-center'>
          Your Orders
        </h2>
        {!orders.length && !loading && !loader && (
          <p className='mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center'>
            You haven't placed any orders
          </p>
        )}
        {orders?.length > 0 && (
          <>
            <p className='mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center'>
              Thanks for making a purchase you can check your order summary frm
              below
            </p>
            <ul>
              {orders.map((order, index) => (
                <li className='mb-8' key={index}>
                  <OrderItem order={order} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
