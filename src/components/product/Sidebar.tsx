import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";
import { Category } from "../../types/Category";
type PropType = {
  categoryChanged: (categories: string[]) => void;
  sliderChanged: (price: number) => void;
  maxSliderValue: number;
};

export default function Sidebar(props: PropType) {
  const [sliderValue, setSliderValue] = useState(props.maxSliderValue);
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllCategories = async () => {
    try {
      const url = "https://fakestoreapi.com/products/categories";
      const resp = await fetch(url);
      const res = await resp.json();
      const cats = res.map((cat: string) => {
        return {
          name: cat,
          isChecked: false,
        };
      });
      setCategories(cats);
      console.log("data ==>", cats);
    } catch (error) {
      console.log("get all cats error", error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  const slided = (value: number | number[]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    setSliderValue(value);
  };
  const sliderChanged = (price: number | number[]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    props.sliderChanged(price);
  };
  const onAddingItem = (index: number) => {
    const updated = categories.map((item, i) => {
      if (i === index) {
        item.isChecked = !item.isChecked;
      }
      return item;
    });
    setCategories(updated);
    const selectedCategories = updated
      .filter((category) => category.isChecked)
      .map((item) => item.name);
    props.categoryChanged(selectedCategories);
  };

  return (
    <>
      <div className="basis-2/12 flex bg-slate-100 w-full sticky top-0 h-screen">
        <div className="sticky top-0 flex flex-col items-center w-full p-4 mt-8">
          <h3 className="font-bold text-xl mb-8">Filter</h3>
          <p className="font-normal text-base">Price: {sliderValue}</p>
          <Slider
            value={sliderValue}
            min={1}
            max={props.maxSliderValue}
            step={Math.floor(props.maxSliderValue / 20)}
            onChange={slided}
            onChangeComplete={sliderChanged}
            trackStyle={{
              backgroundColor: "blue",
              width: `${(sliderValue / props.maxSliderValue) * 100}%`,
            }}
            railStyle={{
              backgroundColor: "gray",
            }}
            handleStyle={{
              borderColor: "blue",
              backgroundColor: "white",
            }}
          />
          <h3 className="font-bold text-base mt-8 mb-4">Category</h3>
          <ul className="flex flex-col ">
            {categories.map((category, index) => (
              <li key={category.name}>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id"
                    value={category.name}
                    checked={category.isChecked}
                    onChange={() => onAddingItem(index)}
                  />
                  <label htmlFor="some_id">{category.name}</label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
