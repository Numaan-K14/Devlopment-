import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { OutLet } from "../Components/OutLet";
import { Home } from "../Components/Home";
import { PersonalInfo } from "../Components/PersonalInfo";
import { ContactInfo } from "../Components/ContactInfo";
import { Document } from "../Components/Document";
import { Profile } from "../Components/Profile";
import { ErrorPage } from "../Components/ErrorPage";

export function Router() {
  const routing = createBrowserRouter([
    {
      path: "/",
      element: <OutLet />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/PersonalInfo",
          element: <PersonalInfo />,
        },
        {
          path: "/ContactInfo",
          element: <ContactInfo />,
        },
        {
          path: "/Document",
          element: <Document />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={routing} />
    </div>
  );
}
