import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { ClientLeaderShipLevelCreateInterface } from "@/interfaces/leadership-level";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import * as Yup from "yup";

const ClientDialog = ({
  handleClose,
  id,
  nbolLeadershipData,
}: {
  handleClose: any;
  id?: any;
  nbolLeadershipData: any[];
}) => {
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post(`/client-role/${id}`, data),
    onSuccess: (data) => {
      toast.success(data?.data?.msg || "Client Job Grade Added Successfully");
      handleClose();
      queryClient.refetchQueries({
        queryKey: [`/client-role/${id}`],
      });
    },
    onError: (error) => {
      toast.error("Please fill all the required field !");
    },
  });

  const initialValues: ClientLeaderShipLevelCreateInterface = {
    role: [""],
    nbolId: "",
  };

  const validationSchema = Yup.object().shape({
    nbolId: Yup.object().required("This field is required"),
    role: Yup.array()
      .of(Yup.string().required("This field is required"))
      .min(1, "At least one role is required"),
  });

  return (
    <CustomDialog 
    title={"Add Client Job Grade"} 
    className={'max-w-[1116px]'}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formattedData = {
            nbolId: values?.nbolId?.id,
            role: values.role.map((role: string) => role),
          };
          mutate(formattedData);
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className='flex gap-5 flex-wrap items-center'>
              <FieldArray
                name='role'
                render={({ push, remove }) => (
                  <div className='flex flex-wrap  gap-5 mt-3 mb-10'>
                    {values.role.map((_: any, index: number) => (
                      <div key={index} className='flex gap-3 items-center '>
                        <CustomInput
                          required
                          name={`role.${index}`}
                          label={`Client Job Grade`}
                          className='w-[335px]'
                        />
                        {values?.role?.length - 1 === index && (
                          <div className='flex mt-6 gap-5'>
                            <IoMdAdd
                              size={20}
                              className='text-green-500 cursor-pointer hover:text-green-700'
                              onClick={() => push("")}
                            />
                            {index > 0 && (
                              <RxCross2
                                size={20}
                                className='text-red-500 cursor-pointer hover:text-red-700'
                                onClick={() => remove(index)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
            <div>
              <CustomSelect
                required
                key={values?.nbolId?.id}
                name='nbolId'
                className='w-[494.33px] h-[48px] mb-10'
                label='Link with NBO Leadership Level'
                options={nbolLeadershipData || []}
                getOptionLabel={(item: any) => item?.leadership_level}
                getOptionValue={(item: any) => item}
                onChange={(item) => setFieldValue("nbolId", item)}
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
                  {"Add"}
                </CustomButton>
              </div>
            </DialogFooter>
          </Form>
        )}
      </Formik>
    </CustomDialog>
  );
};

export default ClientDialog;
