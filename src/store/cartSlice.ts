import {
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { addDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { CartItem } from '../types/CartItem';
import { Order } from '../types/Order';
import { ProductItem } from '../types/ProductItem';
import type { RootState } from './store';

import { successAlert } from '../utils/Alert';
import { db } from './../firebaseInit';
import { getDocs, query, where, doc } from 'firebase/firestore';
import { CartItem as CartItemType } from '../types/CartItem';

// Define the initial state using that type
const initialState = {
  allProducts: [] as ProductItem[],
  cartItems: [] as CartItem[],
  orders: [] as Order[],
  loader: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    // onAddToCart: (state, action: PayloadAction<ProductItem>) => {},
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    setOrder: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
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
  },
});

export const { setItems, setOrder, setProducts, showLoader, hideLoader } =
  cartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export const cartReducer = cartSlice.reducer;

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
export const onAddToCart = createAsyncThunk<
  void,
  ProductItem,
  AsyncThunkConfig
>('cart/onAddToCart', async (product: ProductItem, thunkApi) => {
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
      const doc = await addDoc(collection(db, 'Cart'), item);
      updatedItems = [...cartItems, { ...item, cartId: doc.id }];
    } else {
      const cartItem = cartItems[index];
      const quantity = cartItem.quantity + 1;
      await updateDoc(doc(db, 'Cart', cartItem.cartId), {
        quantity,
      });
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
    console.log('updadte state is ', updatedItems);

    thunkApi.dispatch(setItems(updatedItems));
    successAlert(
      index === -1 ? 'Successfully added' : 'Increasesd product count'
    );
  } catch (error) {
    console.log('error happened in', error);
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});
/**
 * remove a cartItem
 */
export const removeFromCart = createAsyncThunk<
  void,
  CartItem,
  AsyncThunkConfig
>('cart/removeFromCart', async (cartItem: CartItem, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const {
      cart: { cartItems },
    } = thunkApi.getState() as RootState;
    await deleteDoc(doc(db, 'Cart', cartItem.cartId));
    thunkApi.dispatch(
      setItems(cartItems.filter((item) => item.id != cartItem.id))
    );
    successAlert('removed from cart');
  } catch (error) {
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

/**
 * decreases quantity of a item by 1
 * removes whole product if quantity is just 1
 */

export const decreaseCartItemQuantity = createAsyncThunk<
  void,
  CartItem,
  AsyncThunkConfig
>('cart/decreaseCartItemQuantity', async (cartItem: CartItem, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const {
      cart: { cartItems },
    } = thunkApi.getState() as RootState;
    const index = cartItems.findIndex((item) => item.id == cartItem.id);
    if (index === -1) return;
    cartItem = cartItems[index];
    const { quantity } = cartItem;
    let updatedItems = [] as CartItem[];
    if (quantity == 1) {
      await deleteDoc(doc(db, 'Cart', cartItem.cartId));
      updatedItems = cartItems.filter((item) => item.id != cartItem.id);
    } else {
      await updateDoc(doc(db, 'Cart', cartItem.cartId), {
        quantity: quantity - 1,
      });
      updatedItems = cartItems.map((item, i) => {
        if (i === index) return { ...cartItem, quantity: quantity - 1 };
        return item;
      });
    }
    thunkApi.dispatch(setItems(updatedItems));
    //setLoading(false);
  } catch (error) {
    console.log('error in remove oneItem ==>', error);
    //setLoading(false);
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

/**
 * on checkout clear cart from local and db and add those data to orders collection in firebase
 */
export const onCheckout = createAsyncThunk<void, string, AsyncThunkConfig>(
  'cart/onCheckout',
  async (uid: string, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const {
        cart: { cartItems, orders },
      } = thunkApi.getState() as RootState;
      let orderTotal = 0;
      const orderItems = cartItems.map((item) => {
        const total = item.price * item.quantity;
        orderTotal += total;
        return {
          ...item,
          total,
        };
      });
      const order = {
        items: orderItems,
        total: orderTotal,
        date: new Date(),
        uid,
      };
      const orderDoc = await addDoc(collection(db, 'Orders'), order);
      const temp = [...cartItems];
      thunkApi.dispatch(
        setOrder([...orders, { ...order, orderId: orderDoc.id }])
      );
      successAlert('Your orders added successfully');
      // clearing Cart();

      for (const cartItem of temp) {
        await deleteDoc(doc(db, 'Cart', cartItem.cartId));
      }
      thunkApi.dispatch(setItems([]));
    } catch (error) {
      console.log('error in remove oneItem ==>', error);
      //setLoading(false);
    } finally {
      thunkApi.dispatch(hideLoader());
    }
  }
);

/**
 * set initial cart data
 */

export const setInitialCart = createAsyncThunk<void, string, AsyncThunkConfig>(
  'cart/setInitialCart',
  async (uid: string, thunkApi) => {
    try {
      thunkApi.dispatch(showLoader());
      const q = query(collection(db, 'Cart'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const list: CartItemType[] = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
        const item = {
          cartId: doc.id,
          ...doc.data(),
        };
        list.push(item as CartItemType);
      });
      thunkApi.dispatch(setItems(list));
    } catch (error) {
    } finally {
      thunkApi.dispatch(hideLoader());
    }
  }
);

/**
 * set initial cart data
 */

export const setInitialOrders = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>('cart/setInitialOrders', async (uid: string, thunkApi) => {
  //firebase.google.com/docs/firestore/ttl
  https: try {
    thunkApi.dispatch(showLoader());
    const q = query(collection(db, 'Orders'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const list: Order[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      const date = data.date.toDate();
      const item = {
        ...data,
        orderId: doc.id,
        date,
      };
      list.push(item as Order);
    });
    thunkApi.dispatch(setOrder(list));
  } catch (error) {
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});

/**
 * set initial product (all)
 */
export const setInitialProducts = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>('cart/setInitialProducts', async (_, thunkApi) => {
  try {
    thunkApi.dispatch(showLoader());
    const url = 'https://fakestoreapi.com/products';
    const resp = await fetch(url);
    const res = await resp.json();
    thunkApi.dispatch(setProducts(res));
  } catch (error) {
  } finally {
    thunkApi.dispatch(hideLoader());
  }
});
