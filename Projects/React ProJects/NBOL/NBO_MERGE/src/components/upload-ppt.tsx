import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import CustomButton from "./button";
import { CustomDialog } from "./dialog";
import { DropZone } from "./inputs";
import { DialogFooter } from "./ui/dialog";

const UploadPPtDialog = ({
  handleClose,
  refetchQuire,
  url,
  title,
  Id,
  data,
}: {
  handleClose: any;
  refetchQuire: any;
  clientId?: string;
  url: string;
  title?: string;
  nbolLeaderShipData?: any;
  showNbolDropdown?: boolean;
  data?: any;
  Id?: string;
}) => {
  // const validationSchema = Yup.object().shape({
  //   file: Yup.mixed().required("This field is required"),
  // });
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("This field is required")
      .test("fileSize", "File size must be less than 10 MB", (value: any) => {
        const file = value?.[0] ?? value;
        if (!file) return false;
        return file.size <= 10 * 1024 * 1024;
      }),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`${url}`, data),
    onSuccess: (data) => {
      toast.success(data.data.message || "uploaded successfully.");
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
      handleClose();
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  // console.log(data, "<---------- data");

  return (
    <div>
      <CustomDialog
        title={title}
        className={"max-w-[1116px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
        {/* <PageHeading variant='secondary' className='mb-2'>
          Upload PPT
        </PageHeading> */}
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            file: data || "",
            id: Id || "",
            is_uploaded: "",
          }}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append("ppt", values?.file[0]);
            formData.append("id", values?.id);
            formData.append("is_uploaded", values?.is_uploaded);
            mutate(formData);
          }}
        >
          {({ values, setFieldValue, errors }) => (
            // console.log(values),
            <Form>
              <div className='flex flex-col gap-10 pb-10'>
                <div className=''>
                  <DropZone
                    name='file'
                    className='w-full'
                    accept={{
                      ppt: [".ppt", ".pptx"],
                    }}
                  />
                  {errors?.file && (
                    <p className='text-sm text-red-500 mt-1'>
                      {typeof errors.file === "string"
                        ? errors.file
                        : Array.isArray(errors.file)
                          ? errors.file.join(", ")
                          : ""}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>
                  {/* <CustomButton
                      variant='outline'
                      type='submit'
                      isPending={isPending}
                      disabled={!Array.isArray(values?.file)}
                      onClick={() => setFieldValue("is_uploaded", "inprogress")}
                    >
                      Save
                    </CustomButton> */}
                  <CustomButton
                    type='submit'
                    isPending={isPending}
                    onClick={() => setFieldValue("is_uploaded", "inprogress")}
                    disabled={!Array.isArray(values?.file)}
                  >
                    Submit
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
      {/* {open && <SuccessDialog setOpen={setOpen} handleClose={handleClose} />} */}
    </div>
  );
};

export default UploadPPtDialog;
