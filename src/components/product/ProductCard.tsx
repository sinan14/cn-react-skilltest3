import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
// import { useAuthContext } from "../../hooks/useAuthContext";
import editIcon from "../../assets/editIcon.png";
import deleteIcon from "../../assets/deleteIcon.png";
type propsType = {
  image: string;
  price: number;
  title: string;
  id: number;
  description: string | undefined;
  onAddCart: (id: number) => void;
  deleteProduct: (id: number) => void;
  startEdit: (id: number) => void;
};

export default function ProductCard({
  image,
  price,
  title,
  id,
  onAddCart,
  deleteProduct,
  startEdit,
  description,
}: propsType) {
  // const { loading } = useAuthContext();
  const { loading } = useAppSelector((state) => state.auth);
  const [addingToCart, setAddingToCart] = useState(false);
  const addCartHandle = (id: number) => {
    setAddingToCart(true);
    onAddCart(id);
  };
  return (
    <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md flex-1 basis-1/4">
      <a
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
        href="#"
      >
        <img className="object-cover" src={image} alt="product image" />
      </a>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{title}</h5>
        </a>
        {description && (
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p className="text-sm font-normal text-slate-900 text-ellipsis line-clamp-2">{description}</p>
          </div>
        )}

        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">₹{price}</span>
          </p>
        </div>
        <a
          href="#"
          onClick={() => addCartHandle(id)}
          className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {loading && addingToCart ? (
            <>Adding to cart</>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to cart
            </>
          )}
        </a>
      </div>
      <div className="flex justify-between items-center ">
        <img
          className="object-cover"
          src={editIcon}
          alt="product image"
          onClick={() => startEdit(id)}
        />
        <img
          className="object-cover"
          src={deleteIcon}
          alt="product image"
          onClick={() => deleteProduct(id)}
        />
      </div>
    </div>
  );
}
