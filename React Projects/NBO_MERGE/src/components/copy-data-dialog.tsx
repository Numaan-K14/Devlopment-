import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { CohortInterface } from "@/interfaces/common";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import CustomButton from "./button";
import { CustomDialog } from "./dialog";
import CustomSelect from "./inputs/custom-select";
import { DialogFooter } from "./ui/dialog";

const CopyDataDialoag = ({
  handleClose,
  CohortData,
  defaultCohort,
  url,
  refetchUrl,
}: {
  handleClose: any;
  CohortData: CohortInterface[];
  defaultCohort: CohortInterface;
  url: string;
  refetchUrl: string;
}) => {
  const validationSchema = Yup.object().shape({
    to: Yup.object().required("This field is required"),
  });

  const [selectedCohort, setSelectedCohort] = useState<CohortInterface>();
  const [initialValues, setInitialValues] = useState<any>({ from: "", to: "" });
  const [to, setTo] = useState<CohortInterface>();
  useEffect(() => {
    if (defaultCohort) {
      setInitialValues({ from: defaultCohort, to: "" });
      setSelectedCohort(defaultCohort);
    }
  }, [defaultCohort]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`${url}/${to?.id}/${defaultCohort?.id}`, data),
    onSuccess(data) {
      handleClose(false);
      toast.success(data.data.msg || "Data Copied Successfully");
      queryClient.refetchQueries({
        queryKey: [refetchUrl],
        exact: false,
      });
    },
    onError(data: any) {
      toast.error(data?.response?.data?.message);
    },
  });
  return (
    <CustomDialog
      title={"Copy Assessment Data"}
      className={"max-w-[1116px] !overflow-visible "}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values: any) => {
          mutate({});
        }}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className='flex flex-col gap-10'>
              <div className='flex gap-5 flex-wrap'>
                <CustomSelect
                  key={"from"}
                  value={selectedCohort}
                  disabled={true}
                  name='from'
                  label='to'
                  className='w-[335px]'
                  options={CohortData || []}
                  getOptionLabel={(item: any) => `${item?.cohort_name}`}
                  getOptionValue={(item: any) => item?.id}
                  required
                />

                <CustomSelect
                  key={"to"}
                  name='to'
                  label='from'
                  className='w-[335px]'
                  options={CohortData || []}
                  getOptionLabel={(item: any) => `${item?.cohort_name}`}
                  getOptionValue={(item: any) => item?.id}
                  required
                  onChange={(item) => {
                    setFieldValue("to", item);
                    setTo(item);
                  }}
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
                    type='submit'
                    isPending={isPending}
                    disabled={isPending}
                  >
                    Save
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

export default CopyDataDialoag;
