import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { useEffect, useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProceedDialoag = ({
  handleClose,
  id,
  state,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  state: any;
}) => {
  console.log(state, "<--------------- state");
  //-------- state management --------//
  const navigate = useNavigate();
  const user_obj = localStorage.getItem("users_obj");
  const user = user_obj && JSON.parse(user_obj);

  const [buttonDisabled, setButtonDisable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setButtonDisable(false);
    }, 1800);
  }, []);
  return (
    <CustomDialog
      className={"max-w-[1116px] p2 "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
      title='Guidelines'
      footer={({ onClose }) => (
        <div className=' flex  items-center gap-5'>
          <CustomButton onClick={() => onClose()} variant='outline'>
            cancel
          </CustomButton>
          <CustomButton
            variant='default'
            disabled={buttonDisabled}
            onClick={() =>
              navigate(`/cbi/cbi-assessment/${state?.quessionnaire_id}`, {
                state: {
                  quessionnaire_id: state.quessionnaire_id,
                  participant_id: user?.participant_id,
                  session_time: state?.session_time,
                  total_sections : state?.total_sections
                },
              })
            }
          >
            <span className='flex gap-1 items-center cursor-pointer text-[#ffffff]'>
              Proceed
            </span>
          </CustomButton>
        </div>
      )}
    >
      <div className='bg-[#EFF6FF] border border-[#BEDBFF] rounded-[14px] p-8 flex flex-col gap-12'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-[#1447E6] text-[16px] leading-6'>
            Rules & Regulations
          </h3>
          <p className='text-[14px] text-[#155DFC] leading-5'>
            Please read carefully before starting your assessment
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Stable internet connection required
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Use a desktop or laptop (mobile not recommended)
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Ensure microphone access if audio recording is enabled
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Close unnecessary applications to prevent interruptions{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Complete the assessment in one sitting when possible{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Answer all questions honestly and completely{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Do not seek external assistance or use reference materials{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Maintain professional conduct throughout{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Your responses are confidential and secure{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Data is processed in accordance with privacy policies{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Results are only accessible to authorized personnel{" "}
            </p>
          </div>
          <div className='flex  items-center gap-2'>
            <IoCheckmarkCircleOutline className='text-[#155DFC] size-4' />
            <p className='text-[14px] text-[#364153] leading-5 '>
              Do not share assessment content with others{" "}
            </p>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default ProceedDialoag;
