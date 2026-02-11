
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSwitch } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./button";
import { CustomDialog } from "./dialog";
import { Label } from "./label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export function AppSidebar({
  items,
  toggleSidebar,
}: {
  items: {
    title: string;
    url: string;
    icon: string;
    id: number;
    children?: {
      title: string;
      url: string;
      icon: string;
      id: number;
    }[];
  }[];
  toggleSidebar?: any;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  // const path = location.pathname.split("/")[1];
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [openRoleDialog, setOpenRoleDialog] = useState(false);

  const { open, setOpen } = useSidebar();
  const toggleMenu = (id: number, firstChildUrl?: string) => {
    if (!open) setOpen(true);

    setOpenMenus({ [id]: true });
    if (firstChildUrl && location.pathname !== `/${firstChildUrl}`) {
      navigate(`/${firstChildUrl}`);
    }
  };

  // console.log(toggleSidebar, "<-------------- toggleSidebar");
  const user = localStorage.getItem("user");
  const user_obj = user && JSON.parse(user);
  const [cookies, setCookie, removeCookie] = useCookies(["current_role"]);
  const [selectedRole, setSelectedRole] = useState(
    cookies.current_role || user_obj?.role || "admin",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSwitchRole = () => {
    setCookie("current_role", selectedRole, { path: "/" });
    if (selectedRole === "admin") navigate("/client-configuration");
    else if (selectedRole === "assessor") navigate("/assessments");
    else navigate(location.pathname);
    setOpenRoleDialog(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    removeCookie("current_role", { path: "/" });
    navigate("/login");
  };
  return (
    <Sidebar
      className='w-[350px] bg-[#0F2654]'
      side='left'
      variant='sidebar'
      collapsible='icon'
    >
      <SidebarContent>
        <SidebarGroup
          className={`flex flex-col gap-5 ${open === false ? "px-[10px]" : "px-[24px]"} `}
        >
          <div className='flex items-center justify-center !h-[36px] mt-[24px]'>
            <img
              src='/icons/nbo-logo-new.svg'
              className='w-[250px] invert brightness-0 opacity-100 '
            />
          </div>

          <div className='flex items-center justify-between mt-6'>
            <div className='flex items-center gap-3 '>
              <Avatar className='!h-[48px] !w-[48px]'>
                <AvatarFallback className='bg-[#2B952B] text-white !text-[14px] font-medium'>
                  {user_obj?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div>
                  <p className='text-[16px] text-white font-semibold'>
                    {user_obj?.name}
                  </p>
                  <p className='text-[12px] text-white font-normal capitalize'>
                    {user_obj?.role}
                  </p>
                </div>
              )}
            </div>
            {/* {open && (
              <SidebarTrigger
                onClick={() => toggleSidebar(false)}
                className='bg-[#8E9FC133] rounded-[8px] h-[36px] w-[36px] text-white'
              />
            )} */}

            <div className='text-white'>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger className='flex items-center gap-3'>
                  <BsThreeDotsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-5'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col gap-2 items-center'>
                      {user_obj?.role === "admin" &&
                        !!user_obj?.assessor_id && (
                          <>
                            <div
                              className='flex items-center justify-between cursor-pointer gap-3 hover:text-[#2B952B] !w-full'
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setTimeout(() => setOpenRoleDialog(true), 100);
                              }}
                            >
                              <span>Switch Role</span>
                              <IoMdSwitch className='size-5' />
                            </div>
                            <Separator />
                          </>
                        )}
                      <div
                        className='flex items-center justify-between cursor-pointer gap-3 hover:text-red-500 !w-full'
                        onClick={handleLogout}
                      >
                        <span>Log Out</span>
                        <TbLogout className='size-5' />
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {openRoleDialog && (
            <CustomDialog onOpenChange={setOpenRoleDialog} title='Switch Role'>
              <div className='flex flex-col gap-4'>
                {user_obj?.role === "admin" && !!user_obj?.assessor_id ? (
                  <>
                    <Label className='text-[14px] text-[#2B952B] mb-2 font-medium'>
                      Switch Role
                    </Label>
                    <div className='flex pb-4 gap-6'>
                      {["admin", "assessor"].map((role) => (
                        <label
                          key={role}
                          className='flex items-center gap-2 text-sm'
                        >
                          <input
                            type='radio'
                            value={role}
                            checked={selectedRole === role}
                            onChange={() => setSelectedRole(role)}
                          />
                          <span className='capitalize'>{role}</span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='pb-4 px-4'>
                    Are you sure you want to log out?
                  </div>
                )}

                <div className='flex border-t-2 py-3 gap-4 justify-end'>
                  <CustomButton
                    onClick={() => setOpenRoleDialog(false)}
                    variant='outline'
                    className='border-gray-300'
                  >
                    Cancel
                  </CustomButton>
                  {user_obj?.role === "admin" && !!user_obj?.assessor_id && (
                    <CustomButton
                      onClick={handleSwitchRole}
                      variant='default'
                      className='bg-blue-500 hover:bg-blue-600 text-white'
                    >
                      Switch Role
                    </CustomButton>
                  )}
                </div>
              </div>
            </CustomDialog>
          )}
          <Separator />

          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item: any) => {
                console.log(item, location);
                const isSelected =
                  location.pathname.includes(`/${item.url}`) ||
                  item.children?.some((child: any) =>
                    location.pathname.includes(`/${child.url}`),
                  );
                // const isSelected =
                //   location.pathname.includes(`/${item.url}`) ||
                //   item.children?.some((child: any) =>
                //     location.pathname.includes(`/${child.url}`),
                //   );

                const hasChildren = item.children && item.children?.length > 0;
                const isOpen = openMenus[item.id];

                return (
                  <div key={item.title}>
                    <SidebarMenuItem
                      className={`h-[52px] flex items-center transition-all duration-200 !rounded-[6px] ${
                        isSelected
                          ? "bg-[rgba(142,159,193,0.4)]"
                          : "hover:bg-[rgba(142,159,193,0.4)]"
                      }`}
                    >
                      <SidebarMenuButton
                        asChild
                        className='bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 data-[state=open]:bg-transparent'
                      >
                        {hasChildren ? (
                          <div
                            className={`flex !items-center gap-2 h-full w-full cursor-pointer ${
                              open ? "px-4 py-2" : "justify-center px-0 py-2"
                            }`}
                            onClick={() =>
                              toggleMenu(item.id, item.children?.[0].url)
                            }
                          >
                            <span
                              className={`!size-7 transition-colors duration-200 text-[#FFFFFF]`}
                              onClick={() => toggleSidebar(true)}
                            >
                              {item.icon}
                            </span>
                            {open && (
                              <span
                                className={`text-base !font-medium leading-6 transition-all duration-200 ${
                                  isSelected
                                    ? "text-[#FFFFFF] font-medium"
                                    : "text-[#FFFFFF]"
                                }`}
                              >
                                {item.title}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={`/${item.url}`}
                            className={`flex items-center  h-full w-full cursor-pointer ${
                              open
                                ? "px-4 py-2 gap-2"
                                : "justify-center items-center px-0 py-2"
                            }`}
                            onClick={() => {
                              if (!open) setOpen(true);
                            }}
                          >
                            <span
                              className={`!size-7 transition-colors duration-200 text-[#FFFFFF]`}
                              onClick={() => toggleSidebar(true)}
                            >
                              {item.icon}
                            </span>
                            {open && (
                              <span
                                className={`text-base !font-medium leading-6 transition-all duration-200 ${
                                  isSelected
                                    ? "text-[#FFFFFF]  font-medium"
                                    : "text-[#FFFFFF]"
                                }`}
                              >
                                {item.title}
                              </span>
                            )}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {hasChildren && isOpen && open && (
                      <div className='ml-8'>
                        {item.children.map((child: any) => {
                          const isChildSelected = location.pathname.includes(
                            `/${child.url}`,
                          );
                          return (
                            <SidebarMenuItem
                              key={child.id}
                              className={` h-[52px] flex items-center transition-all duration-200  ${
                                isChildSelected
                                  ? " bg-[rgba(142,159,193,0.2)] rounded-[6px]"
                                  : "!hover:bg-[rgba(142,159,193,0.4)]  text-black"
                              }`}
                            >
                              <SidebarMenuButton
                                asChild
                                className='bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 data-[state=open]:bg-transparent'
                              >
                                <Link
                                  to={`/${child.url}`}
                                  className='flex gap-4 h-full  py-2 w-full'
                                >
                                  <span
                                    className={`text-base !font-medium leading-6 transition-all duration-200 text-[#FFFFFF] ${
                                      isChildSelected ? "font-medium " : ""
                                    }`}
                                  >
                                    {child.title}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
