import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { LeaderShipLevelCreateInterface } from "@/interfaces/leadership-level";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const NbolDialog = ({
  handleNbolDialogClose,
  id,
  row,
  open,
}: {
  handleNbolDialogClose: () => void;
  id?: string;
  row?: any;
  open: boolean;
}) => {
  //---------- validation schema -------//
  const validationSchema = Yup.object().shape({
    leadership_level: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
  });

  //----------- api calls -----------//

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      id
        ? axios.put(`/nbol-levels/${id}`, data)
        : axios.post(`/nbol-levels`, data),
    onSuccess: (data) => {
      toast.success(
        data?.data?.msg || id
          ? "Leadership Level Updated Successfully"
          : "New Leadership Level Added Successfully",
      );
      handleNbolDialogClose();
      queryClient.refetchQueries({
        queryKey: [`/nbol-levels`],
      });
    },
    onError: (error) => {
      toast.error("Failed to submit data");
    },
  });

  //--------- initial values ----------//
  const initialValues: LeaderShipLevelCreateInterface = {
    leadership_level: row?.leadership_level ? row?.leadership_level : "",
    description: row?.description ? row?.description : "",
  };
  return (
    // <CustomDialog
    // title='Add New Leadership Level'
    // className={'max-w-[1116px]'}
    //   onOpenChange={(isOpen) => {
    //     if (!isOpen) handleNbolDialogClose();
    //   }}
    // >
    <Drawer open={open} onOpenChange={handleNbolDialogClose} width='416px'>
      <div className='px-7 h-full  overflow-y-auto '>
        <div className='h-[60px] w-full absolute top-0 z-50 border-b bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
          {row ? "Update Leadership Level" : "Add Leadership Level"}
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            mutate(values);
            handleNbolDialogClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className='py-20'>
                <div className='flex flex-wrap gap-5  mb-10'>
                  <CustomInput
                    required
                    name='leadership_level'
                    label='Enter Leadership Level Name'
                    className='w-[360px]'
                  />

                  <CustomInput
                    required
                    name='description'
                    label='Description'
                    className='w-[360px]'
                  />
                </div>

                {/* <DialogFooter className='py-4 px-6 border-t'> */}
                <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                  <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
                    <CustomButton
                      variant='outline'
                      type='button'
                      onClick={handleNbolDialogClose}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type='submit'
                      isPending={isPending}
                      disabled={isPending}
                    >
                      {id ? "Update" : "Add"}
                    </CustomButton>
                  </div>
                </div>
                {/* </DialogFooter> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default NbolDialog;
