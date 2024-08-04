import { FormEvent, useState } from "react";
import { errorAlert } from "../../utils/Alert";
import { ProductItem } from "../../types/ProductItem";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addProduct, editProduct } from "../../store/cartSlice";

export default function ProductForm() {
  const dispatch = useAppDispatch();
  const { editItem } = useAppSelector((state) => state.cart);
  const [name, setName] = useState(editItem.title || "");
  const [image, setImage] = useState(editItem.image || "");
  const [price, setPrice] = useState(editItem?.price?.toString() || "");
  const [description, setDescription] = useState(editItem.description || "");

  const onSubmit = (event: FormEvent) => {
    try {
      event.preventDefault();
      if (!name) {
        return errorAlert("name is required");
      }
      if (!image) {
        return errorAlert("image is required");
      }
      if (!price || +price < 1) {
        return errorAlert("invalid price value");
      }
      if (!description) {
        return errorAlert("description is required");
      }
      const item: ProductItem = {
        ...editItem,
        title: name,
        price: +price,
        image,
        description,
        id: editItem?.id ?? new Date().getTime(),
      };
      if (editItem?.id) {
        dispatch(editProduct(item));
        return;
      }
      dispatch(addProduct(item));
    } catch (error) {
      console.log("error ", error);
    }

    // custom form handling here
  };
  return (
    <div className="w-full md:w-96 md:max-w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-1">
        {editItem?.id ? "Edit Product" : "Add Product"}
      </h2>
      <div className="p-6 border border-gray-300 sm:rounded-md">
        <form onSubmit={onSubmit}>
          <label className="block mb-6">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              className="
            block
            w-full
            mt-1
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            border-solid
            border-gray-300 border-[0.3px]
          "
            />
          </label>
          <label className="block mb-6">
            <span className="text-gray-700">Image URL</span>
            <input
              name="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="
              
            block
            w-full
            mt-1

            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            border-solid
            border-gray-300 border-[0.3px]
          "
              required
            />
          </label>
          <label className="block mb-6">
            <span className="text-gray-700">Price</span>
            <input
              name="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="
            block
            w-full
            mt-1
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            border-solid
            border-gray-300 border-[0.3px]
          "
              required
            />
          </label>
          <label className="block mb-6">
            <span className="text-gray-700">Description</span>
            <textarea
              name="message"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
            block
            w-full
            mt-1
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            border-solid
            border-gray-300 border-[0.3px]
          "
              rows={3}
              required
            />
          </label>
          <div className="mb-6">
            <button
              type="submit"
              className="
            h-10
            px-5
            text-indigo-100
            bg-indigo-700
            rounded-lg
            transition-colors
            duration-150
            focus:shadow-outline
            hover:bg-indigo-800
          "
            >
              {editItem.id ? "Update" : "Add"}
            </button>
          </div>
          <div></div>
        </form>
      </div>
    </div>
  );
}
