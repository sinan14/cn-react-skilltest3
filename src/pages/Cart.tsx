import { useAppDispatch, useAppSelector } from "../store/hooks";
import CartItem from "../components/cart/CartItem";
import Checkout from "../components/cart/Checkout";
import { useEffect } from "react";
import { setInitialCart } from "../store/cartSlice";

export default function Cart() {
  const { loading } = useAppSelector((state) => state.auth);
  const { cartItems, loader } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const isCartEmpty = cartItems.length === 0;
  const total = cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  useEffect(() => {
    dispatch(setInitialCart());
  }, [dispatch]);

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        {!loading && !loader && (
          <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">
            Your Cart {isCartEmpty ? "is empty" : ""}
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
