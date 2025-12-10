import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";


export function AppLayOut() {
  return (
    <>
          <Navbar /> 
          <Outlet />
          {/* form react router dom  */}
          <Footer/>
    </>
  ) 
}


