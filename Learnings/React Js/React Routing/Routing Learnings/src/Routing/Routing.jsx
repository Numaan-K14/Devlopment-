import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../Learnings/Home";
import { About } from "../Learnings/About";
import { Contact } from "../Learnings/Contact";
import { AppLayOut } from "../Learnings/AppLayOut";

export function Routing() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayOut />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/About",
          element: <About />,
        },
        {
          path: "/Contact",
          element: <Contact />,
        },
      ],
    },
  ]);
  return <RouterProvider router={Router} />;
}

//
//
//
//
//
//
//

// ROUTING OLD METHOD || METHOD - 2
// import { Home } from "../Learnings/Home";
// import { About } from "../Learnings/About";
// import { Contact } from "../Learnings/Contact";

// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router-dom";

// export function Routing() {
//   const Router = createBrowserRouter(
//     createRoutesFromElements(
//       <>
//         <Route path="/" element={<Home />} />
//         <Route path="/About" element={<About />} />
//         <Route path="/Contact" element={<Contact />} />
//       </>
//     )
//   );
//   return <RouterProvider router={Router} />;
// }
