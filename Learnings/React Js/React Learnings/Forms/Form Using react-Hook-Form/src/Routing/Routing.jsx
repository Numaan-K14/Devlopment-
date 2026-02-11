import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StudentDetails } from "../Project/StudentDetails";
import { ParentDetails } from "../Project/ParentDetails";

export function Routing() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <StudentDetails />,
    },
    {
      path: "/ParentDetails",
      element: <ParentDetails />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
