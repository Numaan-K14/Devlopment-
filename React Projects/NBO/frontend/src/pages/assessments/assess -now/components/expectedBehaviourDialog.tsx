import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FaRegCheckCircle } from "react-icons/fa";

const ExpectedBehaviorsDialoagAssessNow = ({
  handleClose,
  id,
  data,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  data: any;
}) => {
  console.log(data);

  return (
    <CustomDialog
      title={"Expected Behaviors"}
      className={"max-w-[1116px] "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <div className='mt-4 border border-[rgba(0,0,0,0.1)] !rounded-[14px]  p-5'>
        <div className='flex flex-col gap-1 mb-3'>
          <h3 className='text-[#0A0A0A] text-base'>{data.competency}</h3>
          <p className='text-[#5F6D7E]'>{data.description}</p>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='text-[#717182]'>Expected Behaviors:</div>
          <ul className='flex flex-col gap-3'>
            {data.expected_behaviours?.map((behaviour: any) => (
              <li key={behaviour.id} className='flex gap-1 items-center '>
                <FaRegCheckCircle />
                {behaviour.expected_be
                  ? behaviour.expected_be
                  : behaviour.expected_behaviour}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DialogFooter className='py-4  px-6 !border-t'>
        <div className='flex justify-end items-center gap-5'>
          <CustomButton variant='outline' onClick={() => handleClose(false)}>
            Close
          </CustomButton>
        </div>
      </DialogFooter>
    </CustomDialog>
  );
};

export default ExpectedBehaviorsDialoagAssessNow;
