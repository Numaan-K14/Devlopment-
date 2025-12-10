import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { Autocomplete } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { ClientCreateInterface } from "@/interfaces/client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const ParticipantDialog = ({
  handleClose,
  id,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
}) => {
  // ------------- vlidation schema ------------- //
  const validationSchema = Yup.object().shape({
    is_360_client: Yup.boolean(),
    client_name: Yup.string().when("is_360_client", {
      is: false,
      then: (schema) => schema.required("Client Name is required"),
    }),
    nbol_client_name: Yup.mixed().when("is_360_client", {
      is: true,
      then: (schema) => schema.nullable().required("This field is required"),
    }),
    associate_comp: Yup.mixed().when("is_grp_of_comp", {
      is: true,
      then: (schema) => schema.nullable().required("This field is required"),
    }),

    contact_persons: Yup.array().of(
      Yup.object({
        name: Yup.string().required("This field is required"),
        email: Yup.string().email("Invalid email format").notRequired(),
      }),
    ),
  });

  const [initialValues, setInitialValues] = useState<ClientCreateInterface>({
    client_name: "",
    is_360_client: false,
    nbol_client_name: "",
    nbol_client_schema: "",
    nbol_client_id: "",
    is_grp_of_comp: false,
    associate_comp: "",
    logo: null,
    contact_persons: [
      { name: "", email: undefined, department: undefined, mobile: undefined },
    ],
  });

  //-------- api call ---------//

  const { mutate: mutateForImgUpload, isPending: pendingForImgUpload } =
    useMutation({
      mutationFn: ({ data, url }: { data: any; url: string }) =>
        axios.post(url, data),
      onSuccess(data) {
        handleClose(true);
        toast.success(
          data.data.msg || id
            ? "Client Updated Successfully"
            : "Client Added Successfully",
        );
        queryClient.refetchQueries({ queryKey: ["/client/getall-clients"] });
        queryClient.refetchQueries({
          queryKey: [`/client`],
          exact: false,
        });
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      id ? axios.put(`/client/${id}`, data) : axios.post("/client", data),
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const { data: SingleClientData } = useQuery<ClientCreateInterface>({
    queryKey: [`/client/${id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!id,
  });

  //-------- state management --------//

  return (
    <CustomDialog
      title={id ? "Update Participant" : "Add New Participant"}
      className={"max-w-[1116px] "}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) handleClose(false);
      }}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values: any) => {}}
        validationSchema={validationSchema}
      >
        {({ values, handleSubmit }) => (
          <Form>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-wrap gap-8 pb-8 pt-4'>
                <CustomInput
                  required
                  name={`name`}
                  placeholder='Enter name'
                  className='w-[330px] p-2 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  label='Enter name'
                  type='text'
                />
                <CustomInput
                  required
                  name={`email`}
                  placeholder='Email'
                  className='w-[330px] p-2 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  label='Email'
                  type='text'
                />
                <CustomInput
                  required
                  name={`employee_iD`}
                  placeholder='Employee ID'
                  className='w-[330px] p-2 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  label='Employee ID'
                  type='text'
                />
                <CustomInput
                  required
                  name={`department`}
                  placeholder='Department'
                  className='w-[330px] p-2 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500'
                  label='Department'
                  type='text'
                />

                <Autocomplete
                  required
                  className='w-[335px] h-[48px]'
                  label='Leadership Level'
                  name='leadership_level'
                  getOptionLabel={(item: any) => item?.name}
                  getOptionValue={(item: any) => item?.id}
                  options={[]}
                />
              </div>

              <DialogFooter className='py-4  px-6 !border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton
                    variant='outline'
                    onClick={() => handleClose(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    isPending={isPending}
                    disabled={isPending}
                    onClick={() => handleSubmit()}
                  >
                    {id ? "Update Participant" : "Add Participant"}
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

export default ParticipantDialog;
