"use client";
import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  // SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { Logout } from "@/Pages/Popups/Logout";
export function SideMenu({
  sidemenuIcon1,
  sidemenuIcon2,
  sidemenuIcon3,
  sidemenuIcon4,
  sidemenuName1,
  sidemenuName2,
  sidemenuName3,
  sidemenuName4,
}) {
  const [logout, setLogout] = React.useState(false);

  const location = useLocation();
  const isOverview = location.pathname === "/";
  const Participant = location.pathname === "/Participants";
  const Competency = location.pathname === "/Competency";
  const Leadership = location.pathname === "/Leadership";

  let user = JSON.parse(localStorage.getItem("user"));
  // console.log("From SideMenu POPUP", user);

  function AppSidebar() {
    const { open } = useSidebar();
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader
          className={`flex items-center gap-2 ${
            open ? "pt-6 pb-9 px-3" : "py-6 px-1"
          } `}
        >
          <img
            src="icons/Heading.png"
            alt="Sidebar logo"
            className={`transition-all duration-300 ${
              open ? "h-20 w-60 m-auto" : " h-3 w-full"
            }`}
          />
        </SidebarHeader>
        {/* ------User Profile--------- */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 px-3 ">
            {/* User Profile */}
            <img
              src="images/Avatar.jpg"
              alt="User Avatar"
              className={`rounded-full transition-all duration-300 ${
                open ? "h-13 w-13 mx-2 " : "h-6 w-6 mx-0.9"
              }`}
            />
            {/* User Info — hidden when sidebar is collapsed */}
            {open && (
              <div className="flex flex-col">
                <span className="text-[#FDFDFD] font-semibold text-base leading-6">
                  {user?.name}
                </span>
                <p className="text-[#F5F5F5] font-normal text-base leading-6 ">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          {open && (
            <button
              onClick={() => setLogout(true)}
              className="text-white cursor-pointer p-2 rounded-full hover:bg-[#ffffff26]"
            >
              <EllipsisVertical size={22} strokeWidth={2.25} />
            </button>
          )}
        </div>
        {/* ----------------------- */}
        <SidebarContent>
          <SidebarGroup>
            <hr className="border-t border-white my-3" />
            <SidebarGroupLabel
              className={`text-white  font-medium text-base leading-5`}
            >
              Main Menu
            </SidebarGroupLabel>
            {/* ------------------SidebarGroupContent--------------- */}
            <SidebarGroupContent>
              <SidebarMenu>
                {/* ----SidebarMenu-1--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      isOverview
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/">
                      <img
                        src={`/icons/${sidemenuIcon1}`}
                        alt={sidemenuName1}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName1}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-2--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Participant
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Participants">
                      <img
                        src={`/icons/${sidemenuIcon2}`}
                        alt={sidemenuName2}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName2}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-3--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Competency
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Competency">
                      <img
                        src={`/icons/${sidemenuIcon3}`}
                        alt={sidemenuName3}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName3}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-4--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Leadership
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Leadership">
                      <img
                        src={`/icons/${sidemenuIcon4}`}
                        alt={sidemenuName4}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName4}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            {/* --------------------------------------- */}
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Rail — enables hover expand effect */}
        <SidebarRail />
      </Sidebar>
    );
  }
  return (
    <SidebarProvider>
      <div>
        <AppSidebar />
        <Logout open={logout} setOpen={setLogout} />
      </div>
    </SidebarProvider>
  );
}
