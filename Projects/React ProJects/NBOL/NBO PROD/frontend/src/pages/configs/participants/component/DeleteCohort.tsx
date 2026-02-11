import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplete from "@/components/checkbox-autocomplet";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const DeleteCohortDialoag = ({
  handleClose,
  refetchQuire,
  CohortData,
}: {
  handleClose: () => void;
  refetchQuire: string;
  CohortData: any;
}) => {
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.delete(`/cohorts/delete-cohorts`, { data }),
    onSuccess: (data) => {
      toast.success(data.data.msg || "Cohort deleted Successfully");
      handleClose();
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete cohort");
    },
  });

  const ValidationSchema = Yup.object().shape({
    cohort: Yup.array()
      .of(Yup.object().required())
      .min(1, "At least one Cohort is required")
      .required("This field is required"),
  });

  return (
    <div>
      <CustomDialog
        title={"Delete Cohort"}
        className={"max-w-[420px]"}
        onOpenChange={(isOpen: any) => {
          if (!isOpen) handleClose();
        }}
      >
        <Formik
          initialValues={{
            cohort: [],
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values) => {
            const data = values?.cohort?.map((item: any) => item?.id);
            mutate({ ids: data });
          }}
        >
          <Form>
            <div className='flex flex-col mb-5 gap-10 pb-10'>
              <CheckBoxAutocomplete
                required
                className='!w-[362.25px] '
                label={`Select cohort to delete `}
                levels={CohortData || []}
                name={`cohort`}
              />
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
                >
                  Delete
                </CustomButton>
              </div>
            </DialogFooter>
          </Form>
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default DeleteCohortDialoag;
