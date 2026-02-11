import { Label, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplete from "@/components/checkbox-autocomplet";
import { Autocomplete, DropZone } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSwitch from "@/components/inputs/custom-switch";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import {
  Client360InfoInterface,
  ClientCreateInterface,
  ClientInfoInterface,
} from "@/interfaces/client";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import * as Yup from "yup";

const ClientConfigDialog = ({
  handleClose,
  id,
  open,
}: {
  handleClose: (any: boolean) => void;
  id?: string;
  open: boolean;
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

  const [isAssociatClient, setIsAssociatClient] = useState(false);
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

  const { data: AllClients } = useQuery<ClientInfoInterface[]>({
    queryKey: [`/client/getall-clients`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!isAssociatClient,
  });

  const { data: Nbol360Clients } = useQuery<Client360InfoInterface[]>({
    queryKey: [`/client/nbol-360-clients`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  // console.log(SingleClientData, "<----- SingleClientData");
  //-------- state management --------//

  useEffect(() => {
    if (SingleClientData) {
      setInitialValues({
        client_name: SingleClientData?.client_name || "",
        nbol_client_name: SingleClientData?.nbol_client_name || "",
        is_grp_of_comp: SingleClientData?.is_grp_comp,
        logo: SingleClientData?.logo || null,
        associate_comp: SingleClientData?.assoc_companies
          ? SingleClientData?.assoc_companies
          : [],
        contact_persons: SingleClientData?.contact_persons?.map(
          (person: any) => ({
            name: person.name || "",
            email: person.email || "",
            department: person.department || "",
            mobile: person.mobile || "",
          }),
        ) || [{ name: "", email: "", department: "", mobile: "" }],
      });

      setIsAssociatClient(SingleClientData?.assoc_companies?.length);
    }
  }, [SingleClientData]);

  // console.log(initialValues, "<--------- initial values");
  return (
    // <CustomDialog
    //   title={id ? "Update Client" : "Add Client"}
    //   className={"max-w-[1116px] "}
    //   onOpenChange={(isOpen: any) => {
    //     if (!isOpen) handleClose(false);
    //   }}
    // >
    <Drawer open={open} onOpenChange={handleClose} width='613px'>
      <div className=' h-full  overflow-y-auto '>
        <div className='h-[60px] w-full absolute top-0 z-50 border-b px-5 bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
          {SingleClientData ? "Update Client" : "Add Client"}
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values: ClientCreateInterface) => {
            const formatedData = {
              ...(values?.is_grp_of_comp === true
                ? {
                    associate_comp: values?.associate_comp?.map(
                      (item: any) => ({
                        assoc_comp: item?.assoc_comp
                          ? item?.assoc_comp
                          : item?.id,
                      }),
                    ),
                  }
                : undefined),
              is_360_client: values?.is_360_client,
              is_grp_of_comp: values?.is_grp_of_comp,
              contact_persons: values?.contact_persons?.map((person: any) => ({
                name: person.name || undefined,
                email: person.email || undefined,
                department: person.department || undefined,
                mobile: person.mobile || undefined,
              })),
              client_name: values?.is_360_client
                ? values?.nbol_client_name?.name
                : values?.client_name,
              nbol_client_schema: values?.nbol_client_name?.schema_name,
              nbol_client_name: values?.nbol_client_name?.name,
              nbol_client_id: values?.nbol_client_name?.id,
              logo: values?.logo ? values?.logo?.[0] : undefined,
            };

            mutate(formatedData, {
              onSuccess(res: any, variables: any) {
                let formdata: any;
                const formData = new FormData();

                formData.append("client_id", res.data.data.id);
                formData.append("logo", variables.logo);
                formdata = formData;
                mutateForImgUpload({
                  data: formdata,
                  url: `/client/upload-logo`,
                });
              },
            });
          }}
          validationSchema={validationSchema}
        >
          {({ values, handleSubmit }) => (
            // console.log(values, "<----- values"),
            <Form>
              <div className='flex flex-col py-20 px-5 gap-2'>
                {!id && (
                  <>
                    <PageHeading variant='secondary' className='!mb-[12px]'>
                      Basic Info
                    </PageHeading>
                    <div className='flex gap-5 '>
                      <div className='w-[280px] '>
                        <CustomSwitch
                          className='h-[48px] flex items-center bg-[#FAFAFA] px-2'
                          name='is_360_client'
                          label='Is it an Insight 360 Client ?'
                        />
                      </div>
                      {values.is_360_client === true ? (
                        <>
                          <Autocomplete
                            key={
                              values.is_360_client ? "nbol_client" : "regular"
                            }
                            withPortal={false}
                            required
                            className='w-[280px] h-[48px]'
                            label='Client Name'
                            name='nbol_client_name'
                            getOptionLabel={(item: Client360InfoInterface) =>
                              item?.name
                            }
                            getOptionValue={(item: Client360InfoInterface) =>
                              item?.id
                            }
                            options={Nbol360Clients || []}
                          />
                        </>
                      ) : (
                        <CustomInput
                          name='client_name'
                          label='Client Name'
                          className='w-[280px]'
                          required
                          type='text'
                        />
                      )}
                    </div>
                  </>
                )}

                {id && SingleClientData?.is_360_client === true && (
                  <CustomInput
                    disabled
                    name='nbol_client_name'
                    label='Client Name'
                    className='w-[280px]'
                    required
                    type='text'
                  />
                )}
                {id && SingleClientData?.is_360_client === false && (
                  <CustomInput
                    name='client_name'
                    label='Client Name'
                    className='w-[280px]'
                    required
                    type='text'
                  />
                )}
                <div className='flex gap-5 pt-[25px] '>
                  <div className='w-[280px] '>
                    <CustomSwitch
                      className='h-[48px] flex items-center bg-[#FAFAFA] px-2'
                      name='is_grp_of_comp'
                      label='Does this Client have a Parent/Associate Entity?'
                      onChange={() => setIsAssociatClient(true)}
                    />
                  </div>
                  {values.is_grp_of_comp === true && (
                    <>
                      <CheckBoxAutocomplete
                        required
                        className={"!w-[280px]"}
                        label='Parent/Associate Entity Name'
                        levels={AllClients || []}
                        name='associate_comp'
                      />
                    </>
                  )}
                </div>
                <div className='mb-5 pt-[15px]'>
                  <div className='w-[280px]'>
                    <Label>Client Logo</Label>
                    <DropZone
                      name='logo'
                      accept={{ image: [".png", ".jpg"] }}
                      type='secondary'
                    />
                    {!values?.logo && (
                      <span className='text-[10px]'>
                        Recommended size: 340px - 100px
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <PageHeading variant='secondary' className='mb-[16px]'>
                    Client Contact Details
                  </PageHeading>

                  <FieldArray name='contact_persons'>
                    {({ push, remove }) => (
                      <div className=' '>
                        {values.contact_persons.map((_: any, index: any) => (
                          <div
                            key={index}
                            className='relative rounded-lg bg-white  '
                          >
                            <div className='relative mt-2 flex items-center pb-10'>
                              <div className='w-full flex flex-wrap gap-5'>
                                <div className='flex gap-[13px]'>
                                  <div>
                                    <CustomInput
                                      required
                                      name={`contact_persons[${index}].name`}
                                      placeholder='Enter name'
                                      className='w-[280px] p-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      label='Name'
                                      type='text'
                                    />
                                  </div>
                                  <div>
                                    <CustomInput
                                      name={`contact_persons[${index}].email`}
                                      placeholder='Enter email'
                                      className='w-[280px] p-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      label='Email'
                                      type='email'
                                    />
                                  </div>
                                </div>
                                <div className='flex gap-[13px]'>
                                  <div>
                                    <CustomInput
                                      name={`contact_persons[${index}].mobile`}
                                      placeholder='Enter mobile number'
                                      className='w-[280px] p-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      label='Mobile Number'
                                      type='number'
                                    />
                                  </div>
                                  <div className='flex items-center'>
                                    <div>
                                      <Label className='text-sm font-medium'>
                                        Department
                                      </Label>
                                      <CustomInput
                                        name={`contact_persons[${index}].department`}
                                        placeholder='Enter department'
                                        className='w-[280px] p-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className=' !w-full flex gap-2 !items-center justify-end '>
                                  {index ===
                                    values.contact_persons.length - 1 && (
                                    <CustomButton
                                      variant='outline'
                                      onClick={() =>
                                        push({
                                          name: "",
                                          email: "",
                                          department: "",
                                          mobile: "",
                                        })
                                      }
                                    >
                                      <IoMdAdd
                                        size={20}
                                        className='text-green-500 cursor-pointer hover:text-green-700'
                                      />{" "}
                                    </CustomButton>
                                  )}
                                  {values.contact_persons.length > 1 && (
                                    <CustomButton
                                      onClick={() => remove(index)}
                                      variant='outline'
                                    >
                                      <RxCross2
                                        size={20}
                                        className='text-red-500 cursor-pointer hover:text-red-700'
                                      />
                                    </CustomButton>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* <DialogFooter className='py-4  px-6 !border-t'> */}
                <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                  <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
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
                      {id ? "Update" : "Save"}
                    </CustomButton>
                  </div>
                  {/* </DialogFooter> */}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
    // </CustomDialog>
  );
};

export default ClientConfigDialog;
