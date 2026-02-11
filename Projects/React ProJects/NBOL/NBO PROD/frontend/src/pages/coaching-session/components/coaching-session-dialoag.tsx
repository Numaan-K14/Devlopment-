import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { DatePickerComponent } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const CoachingSessionDialoag = ({
  handleClose,
  row,
  assessorsData,
}: {
  handleClose: any;
  row?: any;
  assessorsData: any;
}) => {
  const validationSchema = Yup.object().shape({
    session: Yup.string().required("This field is required"),
    part_id: Yup.object().required("This field is required"),
    start_time: Yup.string().required("This field is required"),
    assessor_id: Yup.object().required("This field is required"),
    end_time: Yup.string().required("This field is required"),
  });
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`/coaching/${row?.id}`, data),
    onSuccess(data) {
      handleClose(false);
      toast.success(" Successful");
      queryClient.refetchQueries({
        queryKey: [`/coaching`],
        exact: false,
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  //-------- state management --------//
  const [initialValues, setInitialValues] = useState<any>({
    session: "",
    client_id: "",
    project_id: "",
    cohort_id: "",
    part_id: "",
    start_time: "",
    end_time: "",
    assessor_id: "",
    vanue: "",
    date: new Date(),
  });

  useEffect(() => {
    if (row) {
      setInitialValues({
        session:
          row?.session === "inperson"
            ? "In porson"
            : row?.session === "virtual"
              ? "Virtual"
              : "",
        part_id: row?.participant || "",
        start_time: row?.start_time || "",
        end_time: row?.end_time || "",
        assessor_id: row?.assessor || "",
        vanue: row?.vanue || "",
        date: row?.date || new Date(),
      });
    }
  }, [row]);
  return (
    <CustomDialog
      title={"Edit"}
      className={"max-w-[1116px] !overflow-visible"}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values: any) => {
          let data = {
            session:
              values?.session === "Virtual"
                ? "virtual"
                : values?.session === "In porson"
                  ? "inperson"
                  : "",
            part_id: values?.part_id?.id || "",
            start_time: values?.start_time || "",
            end_time: values?.end_time || "",
            assessor_id: values?.assessor_id?.id || "",
            assessor_email: values?.assessor_id?.email,
            assessor_name: values?.assessor_id?.assessor_name,
            part_email: values?.part_id?.email,
            part_name: values?.part_id?.participant_name,
            vanue: values?.vanue || "",
            date: values?.date || new Date(),
          };
          mutate(data);
        }}
      >
        {({ values, handleSubmit }) => (
          <Form>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-wrap gap-5'>
                <CustomSelect
                  disabled
                  required
                  label='Participant Name'
                  value={row?.participant}
                  name='part_id'
                  getOptionLabel={(item) => item?.participant_name}
                  getOptionValue={(item) => item?.id}
                  options={row?.participant ? [row?.participant] : []}
                  className='!w-[329.33px]'
                />
                <CustomSelect
                  required
                  label='Assessor Name'
                  name='assessor_id'
                  getOptionLabel={(item) => item?.assessor_name}
                  getOptionValue={(item) => item?.id}
                  options={assessorsData ? assessorsData : []}
                  className='!w-[329.33px]'
                />
                <DatePickerComponent
                  name='date'
                  label='Session Date'
                  className='!w-[329.33px]'
                />

                <CustomSelect
                  required
                  label='Session Format'
                  name='session'
                  getOptionLabel={(item) => item}
                  getOptionValue={(item) => item}
                  options={["In porson", "Virtual"]}
                  className='!w-[329.33px]'
                />
                {values?.session === "In porson" && (
                  <CustomInput
                    label='Venue'
                    name='vanue'
                    className='!w-[329.33px]'
                  />
                )}
                <TimeRangePicker
                  label='Session Time'
                  startTimeName='start_time'
                  endTimeName='end_time'
                />
              </div>
              <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton
                    variant='outline'
                    onClick={() => handleClose(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    // type='submit'
                    isPending={isPending}
                    disabled={isPending}
                    onClick={() => handleSubmit()}
                  >
                    {"Update"}
                  </CustomButton>
                </div>
              </DialogFooter>
            </div>
          </Form>
        )}
      </Formik>
    </CustomDialog>
  );
};

export default CoachingSessionDialoag;
