import { createHashRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { NotFound } from "./components/NotFound";

export default function App() {
  /**
   * Handles route structure
   * Not found for handle any error in route
   */
  const router = createHashRouter([
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
          path: "/cart",
          element: <Cart />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
