import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { DialogFooter } from "@/components/ui/dialog";

const SuccessDialog = ({
  setOpen,
  handleClose,
  titile,
  message,
}: {
  setOpen: (item: boolean) => void;
  handleClose?: () => void;
  titile?: string;
  message?: string;
}) => {
  return (
    <div>
      <CustomDialog
        title={
          <span className='flex items-center gap-3 text-[#4338CA]'>
            <img src='/icons/Checkmark.svg' alt='checkmark'></img>{" "}
            {titile ? titile : "Uploaded Successfully"}
          </span>
        }
        onClose={() => {
          setOpen(false);
        }}
        className={"max-w-[580px] "}
      >
        <div className='py-2'>
          <h2 className='text-[#5F6D7E] '>
            {message
              ? message
              : "Great job! Your file has been uploaded successfully and is ready to go!"}
          </h2>
        </div>

        <DialogFooter className='py-4 px-6 border-t'>
          <div className='flex justify-end items-center gap-5'>
            <CustomButton
              onClick={() => {
                setOpen(false);
                {
                  handleClose && handleClose();
                }
              }}
            >
              Close
            </CustomButton>
          </div>
        </DialogFooter>
      </CustomDialog>
    </div>
  );
};

export default SuccessDialog;
