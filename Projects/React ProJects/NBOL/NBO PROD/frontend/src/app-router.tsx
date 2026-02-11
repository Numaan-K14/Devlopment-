import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/auth/page";
import React from "react";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/facilities",
    element: <LoginPage />,
  },
]);
