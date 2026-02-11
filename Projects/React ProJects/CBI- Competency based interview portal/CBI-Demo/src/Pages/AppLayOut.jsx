import { Outlet } from "react-router-dom";
import { SideMenu } from "../components/custom/SideMenu";

export function AppLayOut() {
  return (
    <>
        <div className="flex min-h-screen">
          {/* <SideMenu sidemenuIcon1="Overview.png" sidemenuName1="Overview" /> */}
          <SideMenu
            sidemenuIcon1="sideIcon1.png"
            sidemenuIcon2="sideIcon2.png"
            sidemenuIcon3="sideIcon3.png"
            sidemenuIcon4="sideIcon4.png"
            // ------Names---------
            sidemenuName1="Dashboard"
            sidemenuName2="Participant"
            sidemenuName3="Competency"
            sidemenuName4="Leadership Level"
          />
          <main className="w-full bg-[#8E9FC11F]">
            <Outlet />
          </main>
        </div>
    </>
  );
}


