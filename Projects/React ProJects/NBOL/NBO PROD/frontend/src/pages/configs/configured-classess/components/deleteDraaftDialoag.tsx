import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeleteDraftDialoag = ({
  handleClose,
  id,
}: {
  handleClose: any;
  id: string;
}) => {
  const navigate = useNavigate();
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.delete(`/class/delete-draftclass/${id}?delete_business_case=false`),
    onSuccess: (data) => {
      toast.success(data.data.msg || "Draft deleted Successfully");
      handleClose();
      navigate("/generate-schedule");
      //   queryClient.refetchQueries({ queryKey: [refetchQuire] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete Draft");
    },
  });

  return (
    <div>
      <CustomDialog
        className={"max-w-[420px]"}
        onOpenChange={(isOpen: any) => {
          if (!isOpen) handleClose();
        }}
      >
        <div className='flex pt-[24px] flex-col gap-5'>
          <img
            src='/icons/Featured-icon.svg'
            alt='Delete Logo'
            className='w-[48px] h-[48px]'
          />
          <p className='font-semibold text-[18px] leading-7'>
            Delete Draft And Reschedule
          </p>
          <div className='text-[14px] leading-5 text-[#535862] '>
            Are you sure you want to delete this draft
            <br /> and reschedule.
          </div>
        </div>
        <DialogFooter className='py-4 px-6 border-t'>
          <div className='flex justify-end items-center gap-5'>
            <CustomButton variant='outline' onClick={() => handleClose()}>
              Cancel
            </CustomButton>
            <CustomButton
              variant='destructive'
              type='submit'
              isPending={isPending}
              disabled={isPending}
              onClick={() => mutate()}
            >
              Delete and proceed
            </CustomButton>
          </div>
        </DialogFooter>
      </CustomDialog>
    </div>
  );
};

export default DeleteDraftDialoag;
