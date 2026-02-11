import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CustomTab from "@/components/custom-tab";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

const ExpectedBehaviorsDialoag = ({
  handleClose,
  id,
  data,
  selectedIndex,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  data: any;
  selectedIndex: number;
}) => {
  //-------- api call ---------//
  // console.log(selectedIndex, "<------------------------------");
  //-------- state management --------//
  const [tabValue, setTabValue] = useState<any>(`${selectedIndex}`);

  return (
    <CustomDialog
      title={"Expected Behaviors"}
      className={"max-w-[1116px] "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <CustomTab
        setValue={setTabValue}
        tabs={data?.map((item: any, index: number) => ({
          label: item?.competency,
          value: index,
        }))}
        value={tabValue}
        className='flex items-center max-w-[1050px] '
      />

      {data?.map(
        (item: any, index: number) =>
          tabValue == index && (
            <div
              key={item.id}
              className='mt-4 border border-[rgba(0,0,0,0.1)] !rounded-[14px]  p-5'
            >
              <div className='flex flex-col gap-1 mb-3'>
                <h3 className='text-[#0A0A0A] text-base'>{item.competency}</h3>
                <p className='text-[#5F6D7E]'>{item.description}</p>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='text-[#717182]'>Expected Behaviors:</div>
                <ul className='flex flex-col gap-3'>
                  {item.expected_behaviours?.map((behaviour: any) => (
                    <li key={behaviour.id} className='flex gap-1 items-center '>
                      <FaRegCheckCircle />
                      {behaviour.expected_behaviour}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
      )}
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

export default ExpectedBehaviorsDialoag;
