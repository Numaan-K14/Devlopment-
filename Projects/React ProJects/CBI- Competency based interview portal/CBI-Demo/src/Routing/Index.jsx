//------------PARTICIPANTS--------------//
// import { Home } from "@/Pages/User/Home";
// import { Section1 } from "@/Pages/User/Section1";
// import { Section2 } from "@/Pages/User/Section2";
// import { Section3 } from "@/Pages/User/Section3";
// ---------------OUTLET---------------------
import { AppLayOut } from "@/Pages/AppLayOut";
//------------ADMIN--------------//
import { AdminDash } from "@/Pages/Admin/AdminDash";
import { Competency } from "@/Pages/Admin/Competency";
import { Leadership } from "@/Pages/Admin/Leadership";
import { Participants } from "@/Pages/Admin/Participants";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export function Index() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayOut />,
      children: [
        // {
        //   path: "/",
        //   element: <Home />,
        // },
        // {
        //   path: "/Section1",
        //   element: <Section1 />,
        // },
        // {
        //   path: "/Section2",
        //   element: <Section2 />,
        // },
        // {
        //   path: "/Section3",
        //   element: <Section3 />,
        // },
        {
          path: "/",
          element: <AdminDash />,
        },
        {
          path: "/Participants",
          element: <Participants />,
        },
        {
          path: "/Competency",
          element: <Competency />,
        },
        {
          path: "/Leadership",
          element: <Leadership />,
        },
      ],
    },
  ]);

  return <RouterProvider router={Router} />;
}
