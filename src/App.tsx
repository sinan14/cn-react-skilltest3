import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import AuthContextProvider from "./components/context-providers/AuthContextProvider";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Myorders from "./pages/Myorders";
import CartContextProvider from "./components/context-providers/CartContextProvider";
import { NotFound } from "./components/NotFound";
import PrivateRoute from "./components/ProtectedRoute";

export default function App() {
  /**
   * Handles route structure
   * Not found for handle any error in route
   * private route to unauthorized access
   */
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <NotFound />,
      element: <Header />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/signin",
          element: <SignIn />,
        },
        {
          path: "/cart",
          element: (
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <PrivateRoute>
              <Myorders />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </AuthContextProvider>
  );
}
