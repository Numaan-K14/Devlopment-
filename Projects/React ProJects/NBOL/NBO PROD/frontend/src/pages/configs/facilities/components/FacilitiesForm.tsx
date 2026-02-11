import { PageHeading } from "@/components";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { FacilityCreateInterface } from "@/interfaces/facility";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import * as Yup from "yup";

interface FacilitiesFormProps {
  handleClose: any;
  projectId?: number | string;
  facility?: any;
  refetchQuire?: any;
  open: boolean;
}

const FacilitiesForm: React.FC<FacilitiesFormProps> = ({
  handleClose,
  projectId,
  facility,
  refetchQuire,
  open,
}) => {
  //-------- validation schena ---------//
  const validationSchema = Yup.object().shape({
    facility_name: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    rooms: Yup.array()
      .of(
        Yup.object().shape({
          room: Yup.string().required("This field is required"),
          room_id: Yup.string().nullable(),
        }),
      )
      .min(1, "At least one room is required"),
  });

  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      facility
        ? axios.put(`/facility/${facility?.id}`, data)
        : axios.post(`/facility/${projectId}`, data),
    onSuccess: (data) => {
      toast.success(
        data.data.msg || facility
          ? "Facility details Updated Successfully"
          : "Facility details uploaded successfully.",
      );
      handleClose();
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  //-------- initial values ---------//
  const initialValues: FacilityCreateInterface = {
    facility_name: facility?.facility_name || "",
    address: facility?.address || "",
    rooms: facility?.room?.map((item: any) => ({
      room: item.room,
      room_id: item.room_id || item.id,
    })) || [{ room: "", room_id: null }],
  };

  return (
    // <CustomDialog
    //   title={facility ? "Edit Facility" : "Add Facility"}
    //   className={"max-w-[1116px]"}
    //   onOpenChange={(isOpen) => {
    //     if (!isOpen) handleClose(false);
    //   }}
    // >
    <Drawer open={open} onOpenChange={handleClose} width='450px'>
      <div className=' h-full  overflow-y-auto '>
        <div className='h-[60px] w-full absolute top-0 z-50 border-b bg-white px-5 border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
          {facility ? "Update Facility" : "Add Facility"}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const formattedData = {
              facility_name: values.facility_name,
              address: values.address,
              rooms: values.rooms.map((roomObj) => ({
                room: roomObj.room,
                room_id: roomObj.room_id,
              })),
            };
            mutate(formattedData);
          }}
        >
          {({ values }) => (
            <Form>
              <div className=' py-20 px-5 flex flex-col gap-2'>
                <div className='flex gap-4 flex-wrap'>
                  <PageHeading variant='secondary' className='mb-[4px]'>
                    Facility Details
                  </PageHeading>
                  <CustomInput
                    name='facility_name'
                    label='Facility Name'
                    className='w-[410px]'
                    required
                  />
                  <CustomInput
                    name='address'
                    label='Address'
                    className='w-[410px]'
                    required
                  />
                </div>
                <FieldArray
                  name='rooms'
                  render={({ push, remove }) => (
                    <div className='flex flex-wrap gap-5 mt-3 mb-10'>
                      {values.rooms.map((roomObj, index) => (
                        <div key={index} className='flex gap-3 items-center'>
                          <CustomInput
                            name={`rooms.${index}.room`}
                            label={`Room ${index + 1}`}
                            className='w-[280px]'
                            required
                          />
                          <div className='flex gap-[13px] mt-7 ml-2 '>
                            {values.rooms.length > 1 && (
                              <CustomButton
                                variant='outline'
                                onClick={async () => {
                                  const room_id = values.rooms[index]?.room_id;
                                  if (room_id) {
                                    try {
                                      await axios.delete(
                                        `/facility/delete-room/${room_id}`,
                                      );
                                      toast.success(
                                        "Room deleted successfully",
                                      );
                                      remove(index);
                                    } catch (error: any) {
                                      toast.error(
                                        error?.response?.data?.message ||
                                          "Failed to delete room",
                                      );
                                    }
                                  } else {
                                    remove(index);
                                  }
                                }}
                              >
                                <RxCross2
                                  size={20}
                                  className='text-red-500 cursor-pointer hover:text-red-700'
                                />
                              </CustomButton>
                            )}
                            {values.rooms.length - 1 === index && (
                              <CustomButton
                                variant='outline'
                                onClick={() =>
                                  push({ room: "", room_id: null })
                                }
                              >
                                <IoMdAdd
                                  size={20}
                                  className='text-green-500 cursor-pointer hover:text-green-700'
                                />
                              </CustomButton>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* <DialogFooter className='py-4 px-6 border-t'> */}
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
                    {facility ? "Update" : "Add"}
                  </CustomButton>
                </div>
              </div>
              {/* </DialogFooter> */}
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
    // {/* </CustomDialog> */}
  );
};

export default FacilitiesForm;
