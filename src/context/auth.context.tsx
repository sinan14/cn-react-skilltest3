/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
/**
 * context to manage auth state and loading state
 */
const AuthContext = createContext({
  loggedIn: false,
  setLoggedIn: (val: boolean) => {},
  loading: false,
  setLoading: (val: boolean) => {},
  uid: "",
  setUid: (val: string) => {},
});

export { AuthContext };
