import {
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { CartItem } from "../types/CartItem";
import { ProductItem } from "../types/ProductItem";
import type { RootState } from "./store";

import { successAlert } from "../utils/Alert";
// import { CartItem as CartItemType } from "../types/CartItem";

// Define the initial state using that type
const initialState = {
  allProducts: [] as ProductItem[],
  cartItems: [] as CartItem[],
  loader: false,
  showProductForm: false,
  editItem: {} as ProductItem,
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    // onAddToCart: (state, action: PayloadAction<ProductItem>) => {},
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },

    setProducts: (state, action: PayloadAction<ProductItem[]>) => {
      state.allProducts = action.payload;
    },
    showLoader: (state) => {
      state.loader = true;
    },
    hideLoader: (state) => {
      state.loader = false;
    },
    showAddProductForm: (state) => {
      state.showProductForm = true;
    },
    hideAddProductForm: (state) => {
      state.showProductForm = false;
      state.editItem = {} as ProductItem;
    },
    setEditItem: (state, action: PayloadAction<ProductItem>) => {
      state.editItem = action.payload;
      state.showProductForm = !state.showProductForm;
    },
  },
});

export const {
  setItems,
  setProducts,
  showLoader,
  hideLoader,
  showAddProductForm,
  hideAddProductForm,
  setEditItem,
} = cartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export const cartReducer = cartSlice.reducer;

export const onAddToCart = createAsyncThunk<
  void,
  ProductItem,
  AsyncThunkConfig
>("cart/onAddToCart", async (product, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const {
      cart: { cartItems },
      auth: { uid },
    } = thunkApi.getState() as RootState;
    const index = cartItems.findIndex((item) => item.id == product.id);
    let updatedItems = [] as CartItem[];
    if (index == -1) {
      const item = { ...product, quantity: 1, uid: uid };
      const url =
        "https://my-json-server.typicode.com/sinan14/fake-server/cart";
      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(item),
      });
      const res = await resp.json();
      console.log("cart items ADDED ==> ", res);
      updatedItems = [
        ...cartItems,
        { ...item, cartId: new Date().getTime().toString() },
      ];
    } else {
      const cartItem = cartItems[index];
      const quantity = cartItem.quantity + 1;
      const url =
        "https://my-json-server.typicode.com/sinan14/fake-server/cart/" +
        cartItem.id;
      const resp = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(cartItem),
      });
      const res = await resp.json();
      console.log("cart items UPDATED ==> ", res);
      updatedItems = cartItems.map((item, i) => {
        if (i === index) {
          return {
            ...cartItem,
            quantity,
          };
        }
        return item;
      });
    }
    console.log("updadte state is ", updatedItems);

    thunkApi.dispatch(setItems(updatedItems));
    successAlert(
      index === -1 ? "Successfully added" : "Increasesd product count"
    );
  } catch (error) {
    console.log("error happened in", error);
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

/**
 * set initial cart data
 */

export const setInitialCart = createAsyncThunk<void, void, AsyncThunkConfig>(
  "cart/setInitialCart",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const url =
        "https://my-json-server.typicode.com/sinan14/fake-server/cart";
      const resp = await fetch(url);
      const res = await resp.json();
      console.log("cart items ==> ", res);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list = res.map((item: any, index: number) => {
        return {
          ...item,
          cartId: index,
        };
      });
      thunkApi.dispatch(setItems(list));
    } catch (error) {
      console.log("error ==>", error);
    } finally {
      thunkApi.dispatch(hideLoader());
    }
  }
);

/**
 * set initial product (all)
 */
export const setInitialProducts = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("cart/setInitialProducts", async (_, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const url =
      "https://my-json-server.typicode.com/sinan14/fake-server/products";
    const resp = await fetch(url);
    const res = await resp.json();
    thunkApi.dispatch(setProducts(res));
  } catch (error) {
    console.log("error ==>", error);
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

/**
 * Delete product thunk
 */

export const deleteProduct = createAsyncThunk<void, number, AsyncThunkConfig>(
  "cart/deleteProduct",
  async (id, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const url =
        "https://my-json-server.typicode.com/sinan14/fake-server/products/" +
        id;
      const resp = await fetch(url, { method: "DELETE" });
      const res = await resp.json();
      console.log("product deleted  ==>", res);
      successAlert("Deletion Successfull!");
      const {
        cart: { allProducts },
      } = thunkApi.getState() as RootState;
      thunkApi.dispatch(
        setProducts(allProducts.filter((product) => product.id != id))
      );
    } catch (error) {
      console.log("error ==>", error);
    } finally {
      thunkApi.dispatch(hideLoader());
    }
  }
);

/**
 * Add product thunk
 */

export const addProduct = createAsyncThunk<void, ProductItem, AsyncThunkConfig>(
  "cart/addProduct",
  async (product, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const url =
        "https://my-json-server.typicode.com/sinan14/fake-server/products";
      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(product),
      });
      const res = await resp.json();
      console.log("product added  ==>", res);
      successAlert("Product creation Succcessfull!");
      const {
        cart: { allProducts },
      } = thunkApi.getState() as RootState;
      thunkApi.dispatch(setProducts([...allProducts, product]));
      thunkApi.dispatch(hideAddProductForm());
    } catch (error) {
      console.log("error ==>", error);
    } finally {
      thunkApi.dispatch(hideLoader());
    }
  }
);
/**
 * Add product thunk
 */

export const editProduct = createAsyncThunk<
  void,
  ProductItem,
  AsyncThunkConfig
>("cart/editProduct", async (product, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const url =
      "https://my-json-server.typicode.com/sinan14/fake-server/products/" +
      product.id;
    const resp = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    const res = await resp.json();
    console.log("product UPDATED  ==>", res);
    successAlert("Successfully updated");
    const {
      cart: { allProducts },
    } = thunkApi.getState() as RootState;
    thunkApi.dispatch(
      setProducts(
        allProducts.map((item) => {
          if (item.id == product.id) {
            return product;
          }
          return item;
        })
      )
    );
    thunkApi.dispatch(hideAddProductForm());
  } catch (error) {
    console.log("error ==>", error);
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: unknown;
  /** type for `thunkApi.dispatch` */
  dispatch?: Dispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: unknown;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};
