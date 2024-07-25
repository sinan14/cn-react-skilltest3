import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
/**
 * custom hook to use auth context value
 */
export function useAuthContext() {
  return useContext(AuthContext);
}
