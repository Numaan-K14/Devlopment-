import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const CohortDialoag = ({
  handleClose,
  refetchQuire,
  url,
}: {
  handleClose: (cohort?: any) => void;
  refetchQuire: string;
  url: string;
}) => {
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post(`${url}`, data),
    onSuccess: (data) => {
      console.log(data, "<---------------- datatatat");
      toast.success(data.data.msg || "Cohort Added Successfully");
      handleClose(data?.data?.data?.newCohort);
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add cohort");
    },
  });

  const validationSchema = Yup.object().shape({
    cohort_name: Yup.string().required("This field is required"),
  });

  return (
    <div>
      <CustomDialog
        title={"Add Cohort"}
        className={"max-w-[390px]"}
        onOpenChange={(isOpen: any) => {
          if (!isOpen) handleClose();
        }}
      >
        <Formik
          initialValues={{
            cohort_name: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          <Form>
            <div className='flex flex-col gap-10 pb-10'>
              <CustomInput
                name='cohort_name'
                label='Enter Cohort name'
                className='w-[335px]'
                required
                type='text'
              />
            </div>

            <DialogFooter className='py-4 px-6 border-t'>
              <div className='flex justify-end items-center gap-5'>
                <CustomButton variant='outline' onClick={() => handleClose()}>
                  Cancel
                </CustomButton>
                <CustomButton
                  type='submit'
                  isPending={isPending}
                  disabled={isPending}
                >
                  Save
                </CustomButton>
              </div>
            </DialogFooter>
          </Form>
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default CohortDialoag;
