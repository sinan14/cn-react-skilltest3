import { ReactNode, useState } from 'react';
import { AuthContext } from '../../context/auth.context';

type AuthContextPropType = {
  children: ReactNode;
};
/**
 * function to keep code clean
 * manages auth related state and loading state
 */
export default function AuthContextProvider({ children }: AuthContextPropType) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, loading, setLoading, uid, setUid }}
    >
      {children}
    </AuthContext.Provider>
  );
}
