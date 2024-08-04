import { useEffect, useState } from "react";
import Modal from "react-modal";
import ProductCard from "../components/product/ProductCard";
import ProductForm from "../components/ProductForm";
import {
  deleteProduct,
  hideAddProductForm,
  onAddToCart,
  setEditItem,
  setInitialProducts,
} from "../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ProductItem } from "../types/ProductItem";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function Home() {
  const dispatch = useAppDispatch();
  const { allProducts, showProductForm } = useAppSelector(
    (state) => state.cart
  );
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [sortByPrice, setSortByPrice] = useState(false);

  const startEditing = (product: ProductItem) => {
    dispatch(setEditItem(product));
  };
  useEffect(() => {
    dispatch(setInitialProducts());
  }, [dispatch]);

  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  const addCartHandle = (id: number) => {
    const product = products.find((p) => p.id == id);
    if (product) {
      dispatch(onAddToCart(product));
    }
  };
  const deleteProductHandle = (id: number) => {
    dispatch(deleteProduct(id));
  };
  const onToggleSortBy = (value: boolean) => {
    if (value) {
      const array: ProductItem[] = [...allProducts].sort(
        (a, b) => a.price - b.price
      );
      console.log("sort value ==>", array);

      setProducts(array);
    } else {
      setProducts([...allProducts]);
    }
    setSortByPrice(value);
  };
  return (
    <>
      <Modal
        isOpen={showProductForm}
        contentLabel="Minimal Modal Example"
        onRequestClose={() => dispatch(hideAddProductForm())}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="realtive">
          <button
            className="absolute bg-black text-white rounded-full right-0 top-0 w-4 h-4 text-xs flex justify-center items-center pb-[2px] pl-[1px]"
            onClick={() => dispatch(hideAddProductForm())}
          >
            x
          </button>
        </div>
        <ProductForm />
      </Modal>
      <div className="mt-6 flex justify-end mr-16 relative">
        <span
          className="text-sm rounded-2xl p-3 bg-[#f7f7f7]"
          onClick={() => !sortByPrice && onToggleSortBy(true)}
        >
          sort by price&nbsp;&nbsp;
        </span>
        {sortByPrice && (
          <span
            onClick={() => onToggleSortBy(false)}
            className="bg-slate-500 rounded-[50%] p-1 text-[10px] absolute translate-y-1"
          >
            x
          </span>
        )}
      </div>
      <div className="flex ml-6 my-5 relative">
        <div className="flex flex-wrap flex-1 ">
          {products.map(({ title, image, price, id, description }, index) => (
            <ProductCard
              title={title}
              price={price}
              id={id}
              image={image}
              key={index}
              onAddCart={addCartHandle}
              description={description}
              deleteProduct={deleteProductHandle}
              startEdit={() => startEditing(products[index])}
            />
          ))}
        </div>
      </div>
    </>
  );
}
