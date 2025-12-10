import { Label } from "@/components";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import CustomSwitch from "@/components/inputs/custom-switch";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { UserCreateInterface } from "@/interfaces/login";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import { object, string } from "yup";

const UsersDialog = ({
  handleClose,
  id,
  refetchQuire,
  selectedUser,
  open,
}: {
  handleClose?: any;
  id?: string;
  refetchQuire?: string;
  selectedUser?: any;
  open: boolean;
}) => {
  //------------- yup validation ----------------//

  console.log(selectedUser, "<-[ selectedUser");
  let validationSchema = object({
    name: string().required(),
    email: string().email().required(),
  });
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      selectedUser?.id
        ? axios.put(`/user/${selectedUser?.id}`, data)
        : axios.post(`/user`, data),
    onSuccess: (data) => {
      toast.success(
        data.data.msg || selectedUser
          ? "User Updated Successfully!"
          : "User Created Successfully!",
      );

      queryClient.refetchQueries({ queryKey: [refetchQuire] });
      handleClose();
    },
    onError: (data: any) => {
      toast.error(data?.response?.data?.message);
    },
  });

  const initialValues: UserCreateInterface = {
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    phone_number: selectedUser?.phone_number || "",
    is_assessor: !!selectedUser?.assessor || false,
  };
  return (
    <div>
      {/* <CustomDialog
        title={"Create User"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      > */}
      <Drawer open={open} onOpenChange={handleClose} width='416px'>
        <div className='px-7 h-full  overflow-y-auto '>
          <div className='h-[60px] w-full absolute top-0 z-50 border-b bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
            {selectedUser ? "Update User" : "Add User"}
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              mutate(values);
            }}
            validationSchema={validationSchema}
            enableReinitialize
          >
            <Form>
              <div className='flex py-20 flex-col gap-5 '>
                <CustomInput name='name' label='Name' required />
                <CustomInput name='email' label='Email' required />
                <CustomInput name='phone_number' label='Phone' />
                {selectedUser?.role !== "participant" && (
                  <div className='mb-5'>
                    <Label>Is Assessor</Label>
                    <CustomSwitch name='is_assessor' />
                  </div>
                )}
              </div>
              {/* <DialogFooter className='py-4 px-6 border-t'> */}
              <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>
                  <CustomButton type='submit' disabled={isPending}>
                    {"Save"}
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

export default UsersDialog;
