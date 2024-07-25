import { Navigate } from 'react-router-dom';
// import { useAuthContext } from "../hooks/useAuthContext";
import { ReactNode } from 'react';
import { useAppSelector } from '../store/hooks';
type PropsType = {
  children: ReactNode;
};
const PrivateRoute = ({ children }: PropsType) => {
  // const { loggedIn } = useAuthContext();
  const { loggedIn } = useAppSelector((state) => state.auth);

  if (!loggedIn) return <Navigate to='/' replace={true} />;
  return children;
};
export default PrivateRoute;
