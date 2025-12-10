import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BreadcrumbBar } from "./breadCrumb-bar";

interface AppBarProps {
  isSidebarOpen?: boolean;
  title?: string;
  subTitle?: string;
  extraButtons?: React.ReactNode;
  showNav?: boolean;
}

const AppBar = ({
  isSidebarOpen,
  title,
  subTitle,
  extraButtons,
  showNav = true,
}: AppBarProps) => {
  const user = localStorage.getItem("users_obj");
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["current_role"]);

  return (
    <div>
      {showNav && <BreadcrumbBar className='-ml-7 w-full fixed top-0' />}
      <div
        className={`fixed top-0 ${showNav ? "mt-[60px]" : ""}   w-full z-50 h-[130px] bg-[rgba(142,159,193,0)]  -ml-7 border-b border-[#DAE0E6]  flex  items-center`}
      >
        <div className='px-7  py-[24px] flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-[30px] leading-[38px] font-semibold'>
              {title || "hello"}
            </h1>
            <p className='text-[#535862] leading-6'>{subTitle || "hello"} </p>
          </div>
        </div>
        {extraButtons && (
          <div className='absolute right-96 '>{extraButtons}</div>
        )}
      </div>
    </div>
  );
};

export default AppBar;
