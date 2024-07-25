// import { useCartContext } from "../../hooks/useCartContext";
import { onCheckout } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

type PropType = {
  total: number;
};
export default function Checkout(props: PropType) {
  // const { checkOut } = useCartContext();
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector((state) => state.auth);
  return (
    <>
      <div className='flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto'>
        <h5 className='text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4'>
          Subtotal
        </h5>

        <div className='flex items-center justify-between gap-5 '>
          <h6 className='font-manrope font-bold text-3xl lead-10 text-indigo-600'>
            ₹{props.total.toFixed(2)}
          </h6>
        </div>
      </div>
      <div className='max-lg:max-w-lg max-lg:mx-auto'>
        <button
          className='rounded-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-indigo-700 '
          onClick={() => dispatch(onCheckout(uid))}
        >
          Checkout
        </button>
      </div>
    </>
  );
}
