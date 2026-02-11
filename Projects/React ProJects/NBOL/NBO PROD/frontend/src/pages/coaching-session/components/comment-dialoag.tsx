import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import RichTextEditor from "@/components/inputs/rich-text";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const CommentDialoag = ({
  handleClose,
  row,
  refetchUrl,
}: {
  handleClose: any;
  row?: any;
  refetchUrl?: string;
}) => {
  //------- state managemant ----------------//
  const [initialValues, setInitialValues] = useState({ comment: "" });

  const validationSchema = Yup.object().shape({
    comment: Yup.string().required("This field is required"),
  });
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/coaching/session-comment/${row?.id}`, data),
    onSuccess(data) {
      handleClose(false);
      toast.success(" Successful");
      queryClient.refetchQueries({
        queryKey: [refetchUrl],
        exact: false,
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const { data: SingleGetData } = useQuery<any>({
    queryKey: [`/coaching/${row?.coaching?.[0]?.id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!row?.coaching?.[0]?.id,
  });

  useEffect(() => {
    if (SingleGetData) {
      setInitialValues({
        comment: SingleGetData?.comment,
      });
    }
  }, [SingleGetData]);
  //-------- state management --------//

  return (
    <CustomDialog
      title={`Participant Name: ${row?.participant_name}`}
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
          mutate(values);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <Form>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-wrap gap-5'>
                <RichTextEditor
                  name='comment'
                  className='h-[313px] mb-20 !w-full'
                  label='Comments'
                  disabled={row?.coaching?.[0]?.commentStatus === "completed"}
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
                  {row?.coaching?.[0]?.commentStatus !== "completed" && (
                    <>
                      <CustomButton
                        // type='submit'
                        isPending={isPending}
                        disabled={
                          isPending ||
                          row?.coaching?.[0]?.commentStatus === "completed"
                        }
                        variant='outline'
                        onClick={() => {
                          setFieldValue("is_draft", "inprogress");
                          handleSubmit();
                        }}
                      >
                        Save
                      </CustomButton>
                      <CustomButton
                        // type='submit'
                        isPending={isPending}
                        disabled={
                          isPending ||
                          row?.coaching?.[0]?.commentStatus === "completed"
                        }
                        onClick={() => {
                          setFieldValue("is_draft", "completed");
                          handleSubmit();
                        }}
                      >
                        Submit
                      </CustomButton>
                    </>
                  )}
                </div>
              </DialogFooter>
            </div>
          </Form>
        )}
      </Formik>
    </CustomDialog>
  );
};

export default CommentDialoag;
