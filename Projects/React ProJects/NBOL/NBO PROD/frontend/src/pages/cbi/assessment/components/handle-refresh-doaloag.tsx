import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";

const HandleRefreshDialoag = ({
  handleClose,
  id,
  handleConfirm,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  handleConfirm: any;
}) => {
  return (
    <div>
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
              onClick={() => handleClose(false)}
              className='w-1/2   rounded-[8px]'
            >
              Cancle
            </CustomButton>
            <CustomButton
              className='w-1/2'
              variant='default'
              onClick={() => handleConfirm()}
            >
              {/* <span className='flex gap-1 items-center cursor-pointer text-[#ffffff]'> */}
              Refresh
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
          <p className='font-semibold text-[18px] leading-7'>Are You Sure ?</p>
          <div className='text-[14px] leading-5 text-[#535862] '>
            If you refresh the page this section will be auto submitted.
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default HandleRefreshDialoag;
