import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';


// Define the initial state using that type
const initialState = {
  loggedIn: false,
  uid: '',
  loading: false,
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
    
  },
});

export const { enableLoader, disableLoader, } =
  authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export const authReducer = authSlice.reducer;
