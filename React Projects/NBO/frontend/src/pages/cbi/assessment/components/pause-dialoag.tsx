import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const PauseDialoag = ({
  handleClose,
  id,
  handleResume,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  handleResume: () => void;
}) => {
  //-------- state management --------//
  const [cookies, setCookie, removeCookie] = useCookies(["current_role"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    removeCookie("current_role", { path: "/" });
    navigate("/login");
  };
  return (
    <CustomDialog
      //   title={id ? "Update Participant" : "Add New Participant"}
      className={"max-w-[290px] p2 "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
      footer={({ onClose }) => (
        <div className='w-full flex  items-center gap-5'>
          <CustomButton
            variant='outline'
            onClick={() => handleLogout()}
            className='w-1/2   rounded-[8px]'
          >
            Sign Out
          </CustomButton>
          <CustomButton
            className='w-1/2'
            variant='default'
            onClick={() => handleResume()}
          >
            {/* <span className='flex gap-1 items-center cursor-pointer text-[#ffffff]'> */}
            Resume Now
            {/* </span> */}
          </CustomButton>
        </div>
      )}
    >
      <div className='flex pt-[24px] flex-col gap-5'>
        <img
          src='/icons/Featured_icon_(1).svg'
          alt='Delete Logo'
          className='w-[48px] h-[48px]'
        />
        <p className='font-semibold text-[18px] leading-7'>Interview Paused </p>
        <div className='text-[14px] leading-5 text-[#535862] '>
          Your Interview has been paused. You can resume it at any time.
        </div>
      </div>
    </CustomDialog>
  );
};

export default PauseDialoag;
