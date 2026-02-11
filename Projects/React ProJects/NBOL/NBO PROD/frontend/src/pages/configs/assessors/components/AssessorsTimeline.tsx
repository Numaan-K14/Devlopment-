import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CustomAccordion from "@/components/custom-accordion";
import { DatePickerWithRange } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import { DialogFooter } from "@/components/ui/dialog";

const AssessorsTimelineDialoag = ({
  handleClose,
  id,
  AssessorTimelineData,
  date,
}: {
  handleClose: any;
  id?: string;
  AssessorTimelineData?: any;
  date: { from: Date; to: Date };
}) => {
  console.log(AssessorTimelineData, "<------------ AssessorTimelineData");
  return (
    <div>
      <CustomDialog
        title={id ? "Update Assessor" : "Add Assessor"}
        className={"max-w-[1116px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      >
        <div className='pb-10 flex flex-col gap-5'>
          <div className='flex gap-5'>
            <div className='!w-1/2'>
              <CustomInput
                disabled
                label='Client'
                value={AssessorTimelineData?.client_name}
              />
            </div>
            <div className='!w-1/2'>
              <DatePickerWithRange
                disabled
                label='Select Date Range'
                value={date}
                className='!w-full h-[48px]'
                buttonClassName='!w-full justify-between'
              />
            </div>
          </div>

          <div className=''>
            <CustomAccordion
              data={AssessorTimelineData?.classes || []}
              // data={[
              //   { title: "string", description: "any" },
              //   { title: "string", description: "any" },
              //   { title: "string", description: "any" },
              // ]}
            ></CustomAccordion>
          </div>
        </div>
        <DialogFooter className='py-4 px-6  border-t'>
          <div className='flex justify-end items-center gap-5'>
            <CustomButton variant='outline' onClick={() => handleClose()}>
              Close
            </CustomButton>
          </div>
        </DialogFooter>
      </CustomDialog>
    </div>
  );
};

export default AssessorsTimelineDialoag;
