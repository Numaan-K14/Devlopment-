import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function OutLet() {
  return (
    <>
          <Navbar />
          <Outlet/>
    </>
  )
}


