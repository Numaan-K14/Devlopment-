import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const SuccessfullySubmitedDialoag = ({
  handleClose,
  id,
  questionAnswerd,
  sections,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  questionAnswerd: number;
  sections: number;
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
      className={"max-w-[488px] p2 "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
      footer={({ onClose }) => (
        <div className='w-full flex justify-center  items-center gap-5'>
          <CustomButton
            variant='default'
            onClick={() => handleLogout()}
            className='w-[194px] font-semibold text-[16px] border-[#D5D7DA] rounded-[8px]'
          >
            Sign Out
          </CustomButton>
        </div>
      )}
    >
      <div className='flex pt-[24px]  gap-5 flex-col items-center '>
        <img
          src='/icons/thums_up.svg'
          alt='Logo'
          className='w-[48px] h-[48px] '
        />
        <div className='flex flex-col gap-1'>
          <p className='font-semibold text-[18px] leading-7 text-center'>
            Assessment Successfully Submitted{" "}
          </p>
          <div className='text-[14px] leading-5 text-[#535862] text-center'>
            Thank you for completing the assessment.
          </div>
        </div>
        <div className='flex gap-2'>
          <div className='w-[136px] h-[136px] border border-[#E9EAEB]  p-4 rounded-[8px] flex flex-col  items-center gap-1'>
            <img
              src='/icons/stack_icon.svg'
              alt='Logo'
              className='w-[32px] h-[32px] '
            />
            <div className='text-center'>
              <p className='text-[#414651] text-[14px]'>{sections}</p>
              <p className='text-[13px] text-[#535862] '>Section completed</p>
            </div>
          </div>
          <div className='w-[136px] h-[136px] border border-[#E9EAEB]  p-4 rounded-[8px] flex flex-col  items-center gap-1'>
            <img
              src='/icons/stack_icon.svg'
              alt='Logo'
              className='w-[32px] h-[32px] '
            />
            <div className='text-center'>
              <p className='text-[#414651] text-[14px]'>
                {" "}
                {questionAnswerd ? questionAnswerd : "-"}
              </p>
              <p className='text-[13px] text-[#535862] '>Questions Answered</p>
            </div>
          </div>
          <div className='w-[136px] h-[136px] border border-[#E9EAEB]  p-4 rounded-[8px] flex flex-col  items-center gap-1'>
            <img
              src='/icons/stack_icon.svg'
              alt='Logo'
              className='w-[32px] h-[32px] '
            />
            <div className='text-center'>
              <p className='text-[#414651] text-[14px]'>
                {new Date().toLocaleDateString()}
              </p>
              <p className='text-[13px] text-[#535862] '>Completion Date</p>
            </div>
          </div>
        </div>
        <div className='border border-[#7DB0F4] bg-[rgba(216,231,252,0.25)] p-4 rounded-[8px] text-[14px] font-medium leading-[20px] text-[#173777] '>
          Report and feedback will be provided by your HR or direct supervisor.
        </div>
      </div>
    </CustomDialog>
  );
};

export default SuccessfullySubmitedDialoag;
