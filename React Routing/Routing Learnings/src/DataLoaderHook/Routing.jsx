import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayOut } from "./LayOut";
import { Home } from "./Home";
import { About } from "./About";
import { Movies } from "./Movies";
import { ErrorPage } from "./ErrorPage";
import { ApiData } from "./ApiData";
import { MoviesDetails } from "./MoviesDetails";
import { SingleCardApiData } from "./SingleCardApiData";

export function Routing() {
  const MoviesRouter = createBrowserRouter([
    {
      path: "/",
      element: <LayOut />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/About",
          element: <About />,
        },
        {
          path: "/Movies",
          element: <Movies />,
          loader: ApiData, // it Only Accepting File NAMES not Component
        },
        {
          path: "/Movies/:MoviesID",//This Path For View Details Buttons
          element: <MoviesDetails />,
          loader: SingleCardApiData,// it Only Accepting File NAMES not Component
        },
      ],
    },
  ]);

  return <RouterProvider router={MoviesRouter} />;
}
