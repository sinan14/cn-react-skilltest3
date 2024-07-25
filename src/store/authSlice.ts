import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define a type for the slice state
// interface CounterState {
//   value: number
// }

// Define the initial state using that type
const initialState = {
  loggedIn: false,
  loading: false,
  uid: '',
};

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    enableLoader: (state) => {
      state.loading = true;
    },
    disableLoader: (state) => {
      state.loading = false;
    },
    loginFail: (state) => {
      state.loggedIn = false;
    },

    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loggedIn = true;
      state.uid = action.payload;
    },
  },
});

export const { enableLoader, disableLoader, loginFail, loginSuccess } =
  authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export const authReducer = authSlice.reducer;
