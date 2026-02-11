import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { AssessorsCreateInterface } from "@/interfaces/assessors";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const AssessorsDialoag = ({
  handleClose,
  id,
  row,
  open,
}: {
  handleClose: () => void;
  id?: string;
  row?: any;
  open: boolean;
}) => {
  // console.log(row, "<------------- row");
  //--------- validation schema -----------//
  const validationSchema = Yup.object().shape({
    assessor_name: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("This field is required"),
  });

  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      id ? axios.put(`/assessors/${id}`, data) : axios.post("/assessors", data),
    onSuccess(data) {
      toast.success(data?.data?.data?.message || "Successful");
      handleClose();
      queryClient.refetchQueries({
        queryKey: [`/assessors`],
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });
  //-------- initial values ---------//
  const initialValues: AssessorsCreateInterface = {
    assessor_name: row?.assessor_name || "",
    email: row?.email || "",
    credential: row?.credential || "",
    status: row ? row?.status : true,
  };

  return (
    <div>
      {/* <CustomDialog
        title={id ? "Update Assessor" : "Add Assessor"}
        className={"max-w-[1116px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      > */}
      <Drawer open={open} onOpenChange={handleClose} width='416px'>
        <div className=' h-full  overflow-y-auto '>
          <div className='h-[60px] w-full absolute top-0 z-50 border-b px-[20px] bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
            {row ? "Update Assessor" : "Add Assessor"}
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={(values: any) => {
              mutate({ ...values });
            }}
            validationSchema={validationSchema}
            enableReinitialize
          >
            <Form>
              <div className='flex gap-6 py-20  px-[20px] flex-wrap'>
                <CustomInput
                  required
                  name='assessor_name'
                  label='Assessor Name'
                  className='w-[360px]'
                ></CustomInput>
                <CustomInput
                  required
                  name='email'
                  label='Email ID'
                  className='w-[360px]'
                ></CustomInput>

                {/* <CustomInput
                  name='credential'
                  label='Credentials'
                  className='w-[360px]'
                ></CustomInput> */}
              </div>

              {/* <DialogFooter className='py-4 px-6  border-t'> */}
              <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type='submit'
                    isPending={isPending}
                    disabled={isPending}
                  >
                    {id ? "update" : "Add"}
                  </CustomButton>
                </div>
              </div>
              {/* </DialogFooter> */}
            </Form>
          </Formik>
        </div>
      </Drawer>

      {/* </CustomDialog> */}
    </div>
  );
};

export default AssessorsDialoag;
