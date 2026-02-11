import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SideMenu } from "./components/custom/Sidemenu";

export default function Layout() {
  const navigate = useNavigate();
  const token: any = localStorage.getItem("token");
  if (token) {
    console.log("token is present");
    // console.log(token, "token>>>>>>>>>");
  }

  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="flex min-h-screen">
      {token && (
      <SideMenu sidemenuIcon1="Overview.png" sidemenuName1="Overview" /> 
        // <SideMenu
        //   sidemenuIcon1="sideIcon1.png"
        //   sidemenuIcon2="sideIcon2.png"
        //   sidemenuIcon3="sideIcon3.png"
        //   sidemenuIcon4="sideIcon4.png"
        //   // ------Names---------
        //   sidemenuName1="Dashboard"
        //   sidemenuName2="Participant"
        //   sidemenuName3="Competency"
        //   sidemenuName4="Leadership Level"
        // />
      )}

      <main className="w-full bg-[#8E9FC11F]">
        <Outlet />
      </main>
    </div>
  );
}
