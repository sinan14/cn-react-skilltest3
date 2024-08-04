import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link, Outlet } from "react-router-dom";
import homeImg from "../assets/home.png";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import cartImg from "./../assets/cart.png";
import addIcon from "./../assets/add.png";

import Loader from "./Loader";
import { showAddProductForm } from "../store/cartSlice";

/**
 * common header for whole application
 */

export default function Header() {
  // The `state` arg is correctly typed as `RootState` already
    const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { loader, cartItems } = useAppSelector((state) => state.cart);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ pointerEvents: loading ? "none" : "auto" }}>
      {(loading || loader) && (
        <div className="relative">
          <Loader />
        </div>
      )}
      <header className="flex flex-row items-center justify-start sm:justify-start py-2 pl-6 pr-4 border-b-2 bg-gray-100 gap-6">
        <Link
          to="/"
          className="flex items-center h-10 px-10 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90"
        >
          Busy Buy
        </Link>
        <nav className="hidden sm:flex justify-between items-center gap-4 font-semibold">
          <Link
            to="/"
            className="hover:text-gray-500 flex justify-between items-center gap-2"
          >
            <img src={homeImg} className="w-8 h-8" />
            <span className="font-semibold text-xl">Home</span>
          </Link>

          <div onClick={() => dispatch(showAddProductForm())} className="flex items-center">
            <img src={addIcon} className="w-8 h-8" />
            <span className="font-semibold text-xl">Add a product</span>
          </div>
          <Link
            to={"/cart"}
            className="hover:text-gray-500  flex justify-between items-center gap-2"
          >
            <span className="relative">
              <img src={cartImg} className="w-8 h-8" />
              <span className="absolute bg-red-500 text-white text-[10px] rounded-[50%] px-1 py[2px] top-0 right-0">
                {cartItems.length}
              </span>
            </span>
            <span className="font-semibold text-xl ">Cart</span>
          </Link>
        </nav>

        <nav className="sm:hidden flex flex-col items-end gap-1 font-semibold">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="sm:hidden font-bold text-xl hover:text-gray-500"
          >
            {showMenu ? <GrClose /> : <GiHamburgerMenu />}
          </button>
          {showMenu && (
            <>
              <Link to="/" className="hover:text-gray-500">
                Home
              </Link>

              <Link to="/cart" className="hover:text-gray-500">
                Cart
              </Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}


