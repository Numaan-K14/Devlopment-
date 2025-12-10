import { useIsMobile } from "@/hooks/use-mobile";
import { MdArrowForwardIos } from "react-icons/md";
import { RiHome6Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

export function BreadcrumbBar({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const pathnameArr = location?.pathname?.slice(1)?.split("/");

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return (
    <Breadcrumb
      className={`!h-[60px] flex justify-between ${className}  fixed !bg-[#0F2654]  items-center border-b-[1.33px] border-[#DAE0E6] px-4 z-10`}
    >
      <div className='flex items-center'>
        <div className='flex gap-2 items-center'>
          {/* <h5 className='font-medium capitalize flex gap-1 items-center'>
            {pathnameArr[0].replace(/([.?*+^$[\]\\(){}-])/g, " ")}
            <IoMdArrowDropdown />
            </h5> */}
          <div className='flex gap-2 items-center '>
            {/* <div className='hover:bg-[rgba(142,159,193,0.4)] hover:!rounded-full hover:!p-2'> */}
            <div className='text-white items-center gap-1 !hover:font-bold  cursor-pointer flex '>
              <RiHome6Line
                className=' text-white size-5 !hover:font-bold  cursor-pointer'
                onClick={() => navigate("/")}
              />{" "}
              <p className='hover:text-white hover:font-semibold text-[14px] '>
                Home
              </p>
            </div>
            {/* </div> */}
            <MdArrowForwardIos className=' text-white' />
          </div>
          <BreadcrumbList>
            {pathnameArr
              ?.filter((item) => !uuidRegex.test(item))
              ?.map((item: string, index: number, arr: string[]) => {
                const fullPath = "/" + arr.slice(0, index + 1).join("/");
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink
                      href={index === arr.length - 1 ? undefined : fullPath}
                      className={`text-[14px] cursor-pointer hover:text-white hover:font-semibold ${
                        index === arr.length - 1 ? "text-white " : "text-white"
                      }`}
                    >
                      {item
                        .replace(/([.?*+^$[\]\\(){}-])/g, " ")
                        .replace(/\w\S*/g, (w) =>
                          w.replace(/^\w/, (c) => c.toUpperCase()),
                        )}
                    </BreadcrumbLink>
                    {index !== arr.length - 1 && (
                      <BreadcrumbSeparator>
                        <MdArrowForwardIos className=' text-white' />
                      </BreadcrumbSeparator>
                    )}
                  </BreadcrumbItem>
                );
              })}
          </BreadcrumbList>
        </div>
      </div>
      {isMobile && <SidebarTrigger />}
    </Breadcrumb>
  );
}
