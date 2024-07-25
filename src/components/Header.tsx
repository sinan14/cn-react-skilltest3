import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../firebaseInit';
import basketImg from './../assets/baket.png';
import cartImg from './../assets/cart.png';
import homeImg from '../assets/home.png';
import loginImg from './../assets/login.png';
import logoutImg from '../assets/logout.png';
// import { useAuthContext } from '../hooks/useAuthContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Loader from './Loader';
// import { useCartContext } from '../hooks/useCartContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  disableLoader,
  enableLoader,
  loginFail,
  loginSuccess,
} from '../store/authSlice';
import { setItems, setOrder } from '../store/cartSlice';

/**
 * common header for whole application
 */

export default function Header() {
  // The `state` arg is correctly typed as `RootState` already
  const { loggedIn, loading } = useAppSelector((state) => state.auth);
  const { loader } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);
  // const { loggedIn, setLoggedIn, loading, setLoading, setUid } =
  //   useAuthContext();
  // const { setCartItems, setOrders } = useCartContext();
  const navigate = useNavigate();

  /**
   * Handles users auth state each refresh or page opesn
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('user is signed in ', user.uid);

        // setLoggedIn(true);
        // setUid(user.uid);
        dispatch(loginSuccess(user.uid));
      } else {
        // User is signed out
        // setLoggedIn(false);
        dispatch(loginFail());
        navigate('/signin');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const loginLogout = async () => {
    // setLoading(true);
    dispatch(enableLoader());

    if (loggedIn == false) {
      navigate('/signin');
    } else {
      await signOut(auth);
    }
    // setLoading(false);
    dispatch(disableLoader());
    dispatch(setItems([]));
    dispatch(setOrder([]));
  };

  return (
    <div style={{ pointerEvents: loading ? 'none' : 'auto' }}>
      {(loading || loader) && (
        <div className='relative'>
          <Loader />
        </div>
      )}
      <header className='flex flex-row items-center justify-between sm:justify-around py-2 pl-6 pr-4 border-b-2 bg-gray-100 gap-6'>
        <Link
          to='/'
          className='flex items-center h-10 px-10 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90'
        >
          Busy Buy
        </Link>
        <nav className='hidden sm:flex justify-between items-center gap-4 font-semibold'>
          {/* <Link to={"/"}> */}
          <Link
            to='/'
            className='hover:text-gray-500 flex justify-between items-center gap-2'
          >
            <img src={homeImg} className='w-8 h-8' />
            <span className='font-semibold text-xl'>Home</span>
          </Link>
          {/* </Link> */}
          <Link
            to='/orders'
            className='hover:text-gray-500  flex justify-between items-center gap-2'
          >
            <img src={basketImg} className='w-8 h-8' />
            <span className='font-semibold text-xl'>My orders</span>
          </Link>
          <Link
            to={'/cart'}
            className='hover:text-gray-500  flex justify-between items-center gap-2'
          >
            <img src={cartImg} className='w-8 h-8' />
            <span className='font-semibold text-xl'>Cart</span>
          </Link>
        </nav>
        <span
          className='hover:text-gray-500  flex justify-between items-center gap-2 ml-auto'
          onClick={loginLogout}
        >
          <img src={loggedIn ? logoutImg : loginImg} className='w-8 h-8' />
          <span className='font-semibold text-xl'>
            {loggedIn ? 'Logout' : 'Login'}
          </span>
        </span>
        <nav className='sm:hidden flex flex-col items-end gap-1 font-semibold'>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className='sm:hidden font-bold text-xl hover:text-gray-500'
          >
            {showMenu ? <GrClose /> : <GiHamburgerMenu />}
          </button>
          {showMenu && (
            <>
              <Link to='/' className='hover:text-gray-500'>
                Home
              </Link>
              <Link to='/orders' className='hover:text-gray-500'>
                My orders
              </Link>
              <Link to='/cart' className='hover:text-gray-500'>
                Cart
              </Link>
              <span onClick={loginLogout} className='hover:text-gray-500'>
                Logout
              </span>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
