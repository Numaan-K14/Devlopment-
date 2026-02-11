// import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/query-client.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { LoginPage } from "./pages/Loginpage.tsx";
import { Home } from "./pages/users/Home.tsx";
import Layout from "./pages/layout.tsx";
import { Section1 } from "./pages/users/Section1.tsx";

createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Section1" element={<Section1 />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-center"
        richColors
        expand
        toastOptions={{
          classNames: {
            toast: "!text-center flex justify-center", // applies to the toast box
            description: "!text-center", // applies to description text
            title: "!text-center", // applies to title text
          },
        }}
      />
    </BrowserRouter>
  </QueryClientProvider>
  // </React.StrictMode>
);
