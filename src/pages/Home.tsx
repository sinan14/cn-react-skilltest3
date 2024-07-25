import { useEffect, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import Sidebar from '../components/product/Sidebar';
import { onAddToCart, setInitialProducts } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ProductItem } from '../types/ProductItem';
// import { useAuthContext } from "../hooks/useAuthContext";
// import { useCartContext } from '../hooks/useCartContext';

export default function Home() {
  const dispatch = useAppDispatch();
  const { allProducts } = useAppSelector((state) => state.cart);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [maxSliderValue, setMaxSliderValue] = useState(1000);
  // const { onAddCart } = useCartContext();
  // const { setLoading } = useAuthContext();
  const sliderChanged = (price: number) => {
    const filteredProducts = allProducts.filter((pdt) => pdt.price <= price);
    setProducts(filteredProducts);
  };
  const categoryChanged = (categories: string[]) => {
    if (categories.length == 0) {
      setProducts([...allProducts]);
      return;
    }
    const filteredProducts = allProducts.filter((pdt) => {
      return categories.includes(pdt.category);
    });

    setProducts(filteredProducts);
  };
  useEffect(() => {
    dispatch(setInitialProducts());
  }, []);
  useEffect(() => {
    setProducts(allProducts);
    if (allProducts.length) {
      const max = allProducts.reduce(function (
        prev: ProductItem,
        current: ProductItem
      ) {
        return prev && prev.price > current.price ? prev : current;
      }); //returns object
      setMaxSliderValue(max.price);
    }
  }, [allProducts]);

  const addCartHandle = (id: number) => {
    const product = products.find((p) => p.id == id);
    if (product) {
      dispatch(onAddToCart(product));
    }
  };
  return (
    <div className='flex ml-6 my-5 relative'>
      <Sidebar
        maxSliderValue={maxSliderValue}
        sliderChanged={sliderChanged}
        categoryChanged={categoryChanged}
      />
      <div className='flex flex-wrap flex-1 '>
        {products.map(({ title, image, price, id }, index) => (
          <ProductCard
            title={title}
            price={price}
            id={id}
            image={image}
            key={index}
            onAddCart={addCartHandle}
          />
        ))}
      </div>
    </div>
  );
}
